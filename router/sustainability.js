const express = require('express');
const router = express.Router();
const axios = require('axios'); // Use axios to make HTTP requests
const db = require('../config/dbconfig'); // Import the dbConfig for database connection

const ORS_API_KEY = '5b3ce3597851110001cf6248d08e06ffbb3e41c992dda690ddcccd2c';

const EMISSION_FACTORS = {
  car: 0.21,
  flight: 0.15,
  bus: 0.1,
  cycling: 0 // Added cycling with zero emissions
};

// Function to geocode a location
async function geocodeLocation(location) {
  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: { 
        api_key: ORS_API_KEY, 
        text: location 
      },
    });

    if (!response.data.features || response.data.features.length === 0) {
      throw new Error(`No results found for location: ${location}`);
    }

    const coords = response.data.features[0]?.geometry.coordinates;
    if (!coords) throw new Error(`Could not geocode location: ${location}`);
    
    console.log(`Geocoded ${location} to coordinates:`, coords);
    return { lon: coords[0], lat: coords[1] };
  } catch (error) {
    console.error(`Error geocoding ${location}:`, error.message);
    throw error;
  }
}

// Function to calculate distance
async function calculateDistance(fromCoords, toCoords, mode) {
  try {
    let profile = 'driving-car';
    if (mode === 'cycling') profile = 'cycling-regular';
    else if (mode === 'bus') profile = 'driving-hgv';
    
    console.log(`Calculating distance with profile: ${profile}`);
    console.log(`From coordinates: [${fromCoords.lon}, ${fromCoords.lat}]`);
    console.log(`To coordinates: [${toCoords.lon}, ${toCoords.lat}]`);

    const directionRes = await axios({
      method: 'POST',
      url: `https://api.openrouteservice.org/v2/directions/${profile}`,
      data: {
        coordinates: [
          [fromCoords.lon, fromCoords.lat],
          [toCoords.lon, toCoords.lat]
        ]
      },
      headers: {
        'Authorization': `Bearer ${ORS_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Direction API response status:', directionRes.status);

    if (!directionRes.data || !directionRes.data.routes || !directionRes.data.routes[0]) {
      console.error('Invalid response structure:', JSON.stringify(directionRes.data));
      throw new Error('Invalid response from directions API');
    }

    const distance = directionRes.data.routes[0].summary.distance / 1000;
    console.log(`Calculated distance: ${distance} km`);
    return distance;
  } catch (error) {
    console.error('Error calculating distance:', error.response?.data || error.message);
    
    if (error.response?.status === 404 || error.response?.status === 400) {
      console.log('Using fallback straight-line distance calculation');
      return calculateStraightLineDistance(fromCoords, toCoords);
    }
    
    throw error;
  }
}

// Function to calculate straight-line distance
function calculateStraightLineDistance(fromCoords, toCoords) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(toCoords.lat - fromCoords.lat);
  const dLon = toRadians(toCoords.lon - fromCoords.lon);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(fromCoords.lat)) * Math.cos(toRadians(toCoords.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  console.log(`Calculated straight-line distance: ${distance} km`);
  return distance;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// The main endpoint to calculate sustainability impact
router.post('/sustainability/calculate', async (req, res) => {
  console.log('Received request body:', req.body);
  const { user_id, from, to, mode } = req.body;

  console.log('EMISSION_FACTORS:', EMISSION_FACTORS);
  console.log('Mode received:', mode);

  const emission_factor = EMISSION_FACTORS[mode] || 0.2; // Default to 0.2 if mode is invalid
  
  try {
    const fromCoords = await geocodeLocation(from);
    const toCoords = await geocodeLocation(to);

    const distance = await calculateDistance(fromCoords, toCoords, mode);
    const carbon_value = distance * emission_factor;

    // Define impact based on mode and distance
    let impact = 'neutral';
    if (mode === 'cycling') {
      impact = 'positive';
    } else if (distance < 5) {
      impact = 'positive';
    } else if (distance > 50) {
      impact = 'negative';
    }

    try {
      // Save data into the database with proper column values
      const [result] = await db.query(`
        INSERT INTO sustainability 
        (user_id, travel_from, travel_to, mode, distance, carbon_value, impact, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [user_id, from, to, mode, distance, carbon_value, impact]);

      console.log('Successfully saved to database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      // You can choose to return an error if saving to the DB is critical
      // res.status(500).json({ message: 'Error saving to the database.' });
    }

    // Respond with calculated data
    res.status(201).json({ 
      distance, 
      carbon_value,
      impact,
      message: mode === 'cycling' ? 
        'Great choice! Cycling has zero carbon emissions.' : 
        `This journey produces ${carbon_value.toFixed(2)} tons of CO2.`
    });
  } catch (error) {
    console.error('Error in calculation:', error.message);
    res.status(500).json({ message: 'Error calculating distance or saving data.' });
  }
});

module.exports = router;

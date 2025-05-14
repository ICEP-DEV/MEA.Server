const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/dbconfig');

const ORS_API_KEY = '5b3ce3597851110001cf6248d08e06ffbb3e41c992dda690ddcccd2c';

const EMISSION_FACTORS = {
  car: 0.21,
  flight: 0.15,
  bus: 0.1
};

// Convert location name (e.g. "Nairobi") to coordinates
async function geocodeLocation(location) {
  const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
    params: { api_key: ORS_API_KEY, text: location },
  });

  const coords = response.data.features[0]?.geometry.coordinates;
  if (!coords) throw new Error(`Could not geocode location: ${location}`);
  return { lon: coords[0], lat: coords[1] };
}
 // POST endpoint to calculate carbon footprint
router.post('/sustainability/calculate', async (req, res) => {
  const { user_id, from, to, mode } = req.body;
  const emission_factor = EMISSION_FACTORS[mode] || 0.2;
console.log("Emission factor: ", emission_factor, "requests-------: ", req.body);
  try {
    const fromCoords = await geocodeLocation(from);
    const toCoords = await geocodeLocation(to);

    // Get distance between coordinates
    const directionRes = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [
          [fromCoords.lon, fromCoords.lat],
          [toCoords.lon, toCoords.lat],
        ],
      },
      { 
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const distance = directionRes.data.features[0].properties.summary.distance / 1000; // km
    const carbon_value = distance * emission_factor;

    const travel_mode = JSON.stringify({ from, to, mode });

    await db.query(`
      INSERT INTO sustainability (user_id, travel_mode, distance, carbon_value, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [user_id, travel_mode, distance, carbon_value]);

    res.status(201).json({ distance, carbon_value });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Error calculating distance or saving data.' });
  }
});

module.exports = router;

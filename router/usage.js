// usageRoute.js or in your routes file
const express = require('express');
const router = express.Router();
const db = require("../config/dbconfig"); // your DB connection file (e.g., using mysql2 or pg)

// GET endpoint to fetch sustainability and daily usage, and all users
router.get('/usage/:id', async (req, res) => {
  const { id: user_id } = req.params;
  console.log(`Fetching usage data for user ID: ${user_id}`);

  try {
    // Fetch sustainability records for the user
    const [sustainabilityData] = await db.query(`
      SELECT travel_from, travel_to, mode, distance, carbon_value, impact, created_at 
      FROM sustainability 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [user_id]);

    // Fetch daily usage records for the user
    const [dailyUsageData] = await db.query(`
      SELECT water_usage, electric_usage, created_at 
      FROM daily_usage 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [user_id]);

    // Respond with both datasets
    res.status(200).json({
      sustainability: sustainabilityData,
      daily_usage: dailyUsageData
    });

  } catch (error) {
    console.error('Error fetching usage data:', error.message);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

router.get('/usageAll/all', async (req, res) => {
  console.log('HIT /usage/all API');

  try {
    // Get all sustainability records (most recent first)
    const [sustainabilityData] = await db.query(`
      SELECT * FROM sustainability ORDER BY created_at DESC
    `);

    // Get all daily usage records (most recent first)
    const [dailyUsageData] = await db.query(`
      SELECT * FROM daily_usage ORDER BY created_at DESC
    `);

    // Get all users (most recent first)
    const [usersData] = await db.query(`
      SELECT * FROM users ORDER BY created_at DESC
    `);

    // Debug: print number of records fetched
    // console.log("✔ Sustainability records:", sustainabilityData.length);
    // console.log("✔ Daily usage records:", dailyUsageData.length);
    // console.log("✔ Users records:", usersData.length);

    // Send response
    res.status(200).json({
      sustainability: sustainabilityData,
      daily_usage: dailyUsageData,
      users: usersData,
    });

  } catch (error) {
    console.error('❌ Error fetching all usage data:', error.message);
    res.status(500).json({ error: 'Failed to fetch all usage data' });
  }
});


module.exports = router;

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

// Import usage data (CSV upload)
router.post('/usage/import', async (req, res) => {
  console.log('HIT /usage/import API');

  try {
    const records = req.body.records;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'No records provided' });
    }

    // 1. Get all user_ids from the records
// Before querying users table
const userIds = [...new Set(records.map(r => Number(r.user_id)))];

    // 2. Query the users table for these user_ids
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE id IN (?)',
      [userIds]
    );
    const existingUserIds = existingUsers.map(u => u.id);

    // 3. Find user_ids that do NOT exist
    const missingUserIds = userIds.filter(id => !existingUserIds.includes(id));

    if (missingUserIds.length > 0) {
      return res.status(400).json({
        error: 'Some user_id values do not exist in users table',
        missingUserIds
      });
    }

    // 4. If all user_ids exist, proceed to insert
    const values = records.map(r => [
      Number(r.user_id),
      r.date,
      r.water_usage,
      r.electric_usage,
      r.created_at
    ]);

    const [result] = await db.query(
      `INSERT INTO daily_usage ( user_id, date, water_usage, electric_usage, created_at)
       VALUES ?`,
      [values]
    );

    res.status(200).json({
      message: 'Usage data imported successfully',
      inserted: result.affectedRows
    });
  } catch (error) {
    console.error('❌ Error importing usage data:', error.message);
    res.status(500).json({ error: 'Failed to import usage data' });
  }
});

module.exports = router;

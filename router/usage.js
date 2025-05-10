// usageRoute.js or in your routes file
const express = require('express');
const router = express.Router();
const db = require("../config/dbconfig"); // your DB connection file (e.g., using mysql2 or pg)

router.get('/usage/:id', async (req, res) => {  // Make the route handler async
  const { id } = req.params;
  console.log(`Fetching usage data for user ID: ${id}`); // Debugging line
  
  try {
    // Fetch from sustainability (with await)
    const [sustainabilityRows] = await db.promise().query(
      'SELECT carbon_value, created_at FROM sustainability WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Fetch from daily_usage (with await)
    const [dailyUsageRows] = await db.promise().query(
      'SELECT water_usage, electric_usage, created_at FROM daily_usage WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Send the response with the fetched data
    res.json({
      sustainability: sustainabilityRows,
      daily_usage: dailyUsageRows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

module.exports = router;

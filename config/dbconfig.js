// dbConfig.js
const mysql = require('mysql2/promise');

// Create a connection pool using the promise-based API
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Ensure that 'root' is being used as the user
  password: '',  // No password set
  database: 'mea_db',  // Replace with your actual database name
  waitForConnections: true,  // Ensure that the pool waits for connections
  connectionLimit: 10,  // Adjust the pool size based on your app's needs
  queueLimit: 0  // Unlimited connection queue
});

module.exports = db;

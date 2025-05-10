const express = require('express');
const app = express();
const usageRoutes = require('./router/usage');  // Correct path
const sustainabilityRoutes = require('./router/sustainability');  // Correct path
const cors = require('cors');
app.use(cors());  // This allows all origins by default

app.use('/api', usageRoutes);  // Prefix with /api
app.use('/api', sustainabilityRoutes);  // Prefix with /api

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

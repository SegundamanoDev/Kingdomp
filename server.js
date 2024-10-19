const express = require('express');
const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.route")
const adminRoutes = require("./routes/admin.route")
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const cors = require("cors")

// Load environment variables
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database connected and tables synced.');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Mount the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
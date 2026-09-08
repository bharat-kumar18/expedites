require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cityRoutes = require("./src/routes/cityRoutes");
const hubRoutes = require("./src/routes/hubRoutes");
const pincodeRoutes = require("./src/routes/pincodeRoutes");


const app = express();

app.use(cors());
app.use(express.json());


// Auth Routes
app.use("/api/auth", authRoutes);
// USER MANAGEMENT ROUTES
// ADMIN ONLY
app.use("/api/users", userRoutes);
// City Route 
app.use("/api/cities", cityRoutes);
// Hub Route
app.use("/api/hubs", hubRoutes);
// Pincode Route
app.use("/api/pincodes", pincodeRoutes);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
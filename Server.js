const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cityRoutes = require("./src/routes/cityRoutes");
const hubRoutes = require("./src/routes/hubRoutes");
const pincodeRoutes = require("./src/routes/pincodeRoutes");
const shipmentRoutes = require("./src/routes/shipmentRoutes");
const pickupRoutes = require("./src/routes/pickupRoutes");
const shipmentMovementRoutes = require("./src/routes/shipmentMovementRoutes");
const deliveryRoutes = require("./src/routes/deliveryRoutes");
const trackingRoutes = require("./src/routes/trackingRoutes");

const app = express();


// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

app.use(cors());

// VERY IMPORTANT
// Must come before all routes
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/cities", cityRoutes);

app.use("/api/hubs", hubRoutes);

app.use("/api/pincodes", pincodeRoutes);

app.use("/api/shipments", shipmentRoutes);

app.use("/api/pickups", pickupRoutes);

app.use("/api/shipment-movements", shipmentMovementRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/tracking", trackingRoutes);


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {

        console.log(
            `Server is running on port ${PORT}`
        );

    });

};

startServer();
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
const paymentRoutes = require("./src/routes/paymentRoutes");
const walletRoutes = require("./src/routes/walletRoutes");
const codRoutes = require("./src/routes/codRoutes");
const shipmentCostRoutes =require("./src/routes/shipmentCostRoutes");
const shipmentPaymentRoutes = require("./src/routes/shipmentPaymentRoutes");
const refundRoutes = require("./src/routes/refundRoutes");
const complaintRoutes = require("./src/routes/complaintRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

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
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/cod", codRoutes);
app.use("/api/shipment-costs", shipmentCostRoutes);
app.use("/api/shipment-payment", shipmentPaymentRoutes);
app.use("/api/refund", refundRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/reports", reportRoutes);

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
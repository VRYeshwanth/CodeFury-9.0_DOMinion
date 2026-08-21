require("dotenv").config();

const express = require("express");
const cors = require("cors");

const explainRoutes = require("./routes/explainRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// -------------------------
// Middleware
// -------------------------

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*"
    })
);

app.use(express.json({
    limit: "100kb"
}));


// -------------------------
// Health Check
// -------------------------

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Saathi backend is running."
    });
});


// -------------------------
// Routes
// -------------------------

app.use("/api/explain", explainRoutes);

app.use("/api/sessions", sessionRoutes);


// -------------------------
// 404 Handler
// -------------------------

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found."
    });
});


// -------------------------
// Global Error Handler
// -------------------------

app.use(errorHandler);


module.exports = app;
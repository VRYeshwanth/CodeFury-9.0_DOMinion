require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const explainRoutes = require("./routes/explainRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");

const authenticate = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// -------------------------
// Security Middleware
// -------------------------

app.use(helmet());

// -------------------------
// CORS
// -------------------------

const allowedOrigin = process.env.FRONTEND_URL;

if (!allowedOrigin) {
    throw new Error(
        "FRONTEND_URL is not configured."
    );
}

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type"
        ]
    })
);

// -------------------------
// Body Parser
// -------------------------

app.use(
    express.json({
        limit: "100kb"
    })
);

// -------------------------
// Cookie Parser
// -------------------------

app.use(cookieParser());

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
// Authentication Rate Limit
// -------------------------

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        error:
            "Too many authentication attempts. Please try again later."
    }
});

// -------------------------
// Authentication Routes
// -------------------------

app.use(
    "/api/auth/login",
    authLimiter
);

app.use(
    "/api/auth/register",
    authLimiter
);

app.use(
    "/api/auth",
    authRoutes
);

// -------------------------
// Protected Application Routes
// -------------------------

app.use(
    "/api/explain",
    authenticate,
    explainRoutes
);

app.use(
    "/api/sessions",
    authenticate,
    sessionRoutes
);

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
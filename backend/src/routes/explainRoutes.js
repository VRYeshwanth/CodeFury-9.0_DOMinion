const express = require("express");

const {
    explainController
} = require("../controllers/explainController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Explain a message
 *
 * Authentication required.
 */
router.post(
    "/",
    authenticate,
    explainController
);

module.exports = router;
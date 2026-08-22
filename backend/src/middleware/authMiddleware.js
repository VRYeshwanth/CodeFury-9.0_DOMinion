const {
    verifyAccessToken,
} = require("../services/authService");

function authenticate(req, res, next) {
    try {
        const token = req.cookies?.saathi_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authentication required.",
            });
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Your session has expired. Please log in again.",
        });
    }
}

module.exports = authenticate;
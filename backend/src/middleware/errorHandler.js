function errorHandler(err, req, res, next) {
    console.error("Backend Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        success: false,
        error: "Something went wrong. Please try again."
    });
}

module.exports = errorHandler;
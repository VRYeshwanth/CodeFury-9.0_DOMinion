const { explainMessage } = require("../services/groqService");

async function explainController(req, res, next) {
    try {
        const { message, language } = req.body;

        // Validate message
        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message cannot be empty."
            });
        }

        // Prevent unnecessarily huge requests
        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                error: "Message is too long."
            });
        }

        // Validate language
        const selectedLanguage =
            language === "kannada" ? "kannada" : "english";

        const explanation = await explainMessage(
            message.trim(),
            selectedLanguage
        );

        return res.status(200).json({
            success: true,
            language: selectedLanguage,
            explanation
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    explainController
};
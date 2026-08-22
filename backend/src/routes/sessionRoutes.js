const express = require("express");

const {
    createSession,
    getSession,
    deleteSession
} = require("../services/sessionService");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);


/**
 * Create a new session
 *
 * POST /api/sessions
 *
 * Authentication required.
 */
router.post("/", (req, res) => {
    const language =
        req.body?.language === "kannada"
            ? "kannada"
            : "english";

    const session = createSession(
        req.user.userId,
        language
    );

    res.status(201).json({
        success: true,
        sessionId: session.id,
        language: session.language
    });
});


/**
 * Get session
 *
 * GET /api/sessions/:sessionId
 *
 * Authentication required.
 */
router.get("/:sessionId", (req, res) => {
    const session = getSession(
        req.params.sessionId,
        req.user.userId
    );

    if (!session) {
        return res.status(404).json({
            success: false,
            error: "Session not found."
        });
    }

    res.json({
        success: true,
        session
    });
});


/**
 * Delete session
 *
 * DELETE /api/sessions/:sessionId
 *
 * Authentication required.
 */
router.delete("/:sessionId", (req, res) => {

    const deleted = deleteSession(
        req.params.sessionId,
        req.user.userId
    );

    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: "Session not found."
        });
    }

    res.json({
        success: true,
        message: "Session deleted."
    });
});


/**
 * Start UPI simulation
 *
 * POST /api/sessions/:sessionId/upi/start
 *
 * Authentication required.
 */
router.post(
    "/:sessionId/upi/start",
    authenticate,
    (req, res) => {

        const session = getSession(
            req.params.sessionId,
            req.user.userId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                error: "Session not found."
            });
        }

        session.upi = {
            active: true,
            step: "recipient",
            recipient: null,
            amount: null,
            confirmed: false
        };

        const isKannada =
            session.language === "kannada";

        res.json({
            success: true,

            step: "recipient",

            question: isKannada
                ? "ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಬೇಕು?"
                : "Who do you want to send money to?"
        });
    }
);


/**
 * Answer current UPI question
 *
 * POST /api/sessions/:sessionId/upi/answer
 *
 * Authentication required.
 */
router.post(
    "/:sessionId/upi/answer",
    authenticate,
    (req, res) => {

        const session = getSession(
            req.params.sessionId,
            req.user.userId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                error: "Session not found."
            });
        }

        if (!session.upi || !session.upi.active) {
            return res.status(400).json({
                success: false,
                error: "UPI flow has not been started."
            });
        }

        const { answer } = req.body;

        if (
            !answer ||
            typeof answer !== "string"
        ) {
            return res.status(400).json({
                success: false,
                error: "Answer is required."
            });
        }

        const isKannada =
            session.language === "kannada";


        /*
         * STEP 1: RECIPIENT
         */
        if (session.upi.step === "recipient") {

            const recipient = answer.trim();

            if (!recipient) {
                return res.status(400).json({
                    success: false,
                    error: isKannada
                        ? "ದಯವಿಟ್ಟು ಸ್ವೀಕರಿಸುವವರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ."
                        : "Please enter the recipient's name."
                });
            }

            session.upi.recipient = recipient;

            session.upi.step = "amount";

            return res.json({
                success: true,

                step: "amount",

                question: isKannada
                    ? "ಎಷ್ಟು ರೂಪಾಯಿ ಕಳುಹಿಸಬೇಕು?"
                    : "How much money do you want to send?"
            });
        }


        /*
         * STEP 2: AMOUNT
         */
        if (session.upi.step === "amount") {

            const amount = Number(
                answer.replace(/,/g, "")
            );

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return res.status(400).json({
                    success: false,

                    error: isKannada
                        ? "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ."
                        : "Please enter a valid amount."
                });
            }

            if (amount >= 100000) {
                return res.status(400).json({
                    success: false,

                    error: isKannada
                        ? "ಡೆಮೊಗಾಗಿ ₹1,00,000 ಕ್ಕಿಂತ ಕಡಿಮೆ ಮೊತ್ತವನ್ನು ಬಳಸಿ."
                        : "For this demo, please use an amount below ₹1,00,000."
                });
            }

            session.upi.amount = amount;

            session.upi.step = "confirmation";

            const recipient =
                session.upi.recipient;

            return res.json({
                success: true,

                step: "confirmation",

                confirmation: isKannada
                    ? `${recipient} ಅವರಿಗೆ ₹${amount} ಕಳುಹಿಸಬೇಕಾಗಿದೆ. ನೀವು ಇದನ್ನು ಖಚಿತಪಡಿಸುತ್ತೀರಾ?`
                    : `You are about to send ₹${amount} to ${recipient}. Do you want to confirm?`,

                transaction: {
                    recipient,
                    amount
                }
            });
        }


        /*
         * Invalid state
         */
        return res.status(400).json({
            success: false,
            error: "Invalid UPI flow state."
        });
    }
);


/**
 * Final confirmation
 *
 * POST /api/sessions/:sessionId/upi/confirm
 *
 * Authentication required.
 */
router.post(
    "/:sessionId/upi/confirm",
    authenticate,
    (req, res) => {

        const session = getSession(
            req.params.sessionId,
            req.user.userId
        );

        if (!session) {
            return res.status(404).json({
                success: false,
                error: "Session not found."
            });
        }

        if (
            !session.upi ||
            session.upi.step !== "confirmation"
        ) {
            return res.status(400).json({
                success: false,
                error: "Transaction is not ready for confirmation."
            });
        }

        const { confirmed } = req.body;

        const isKannada =
            session.language === "kannada";


        /*
         * User cancelled
         */
        if (confirmed !== true) {

            session.upi.active = false;

            session.upi.step = "cancelled";

            return res.json({
                success: true,

                confirmed: false,

                message: isKannada
                    ? "ವಹಿವಾಟು ರದ್ದುಗೊಂಡಿದೆ."
                    : "The transaction has been cancelled."
            });
        }


        /*
         * User confirmed
         */
        session.upi.confirmed = true;

        session.upi.active = false;

        session.upi.step = "completed";

        return res.json({
            success: true,

            confirmed: true,

            /*
             * IMPORTANT:
             *
             * This is only a simulation.
             * No real UPI transaction happens.
             */
            simulated: true,

            message: isKannada
                ? `ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ. ${session.upi.recipient} ಅವರಿಗೆ ₹${session.upi.amount} ಕಳುಹಿಸಿದಂತೆ ತೋರಿಸಲಾಗಿದೆ.`
                : `Demo completed. ₹${session.upi.amount} has been simulated as sent to ${session.upi.recipient}.`,

            transaction: {
                recipient:
                    session.upi.recipient,

                amount:
                    session.upi.amount
            }
        });
    }
);


module.exports = router;
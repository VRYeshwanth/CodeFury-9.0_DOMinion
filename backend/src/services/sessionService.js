const crypto = require("crypto");

const sessions = new Map();


/**
 * Create a new session for an authenticated user.
 *
 * @param {string} userId
 * @param {string} language
 */
function createSession(userId, language = "english") {

    if (!userId) {
        throw new Error("User ID is required to create a session.");
    }

    const sessionId = crypto.randomUUID();

    const session = {
        id: sessionId,

        // The authenticated user who owns this session
        userId,

        language:
            language === "kannada"
                ? "kannada"
                : "english",

        createdAt: new Date().toISOString(),

        upi: {
            active: false,
            step: null,
            recipient: null,
            amount: null,
            confirmed: false
        }
    };

    sessions.set(sessionId, session);

    return session;
}


/**
 * Get a session only if it belongs to the user.
 *
 * @param {string} sessionId
 * @param {string} userId
 */
function getSession(sessionId, userId) {

    const session = sessions.get(sessionId);

    if (!session) {
        return null;
    }

    // Prevent one user from accessing another user's session
    if (session.userId !== userId) {
        return null;
    }

    return session;
}


/**
 * Delete a session only if it belongs to the user.
 *
 * @param {string} sessionId
 * @param {string} userId
 */
function deleteSession(sessionId, userId) {

    const session = sessions.get(sessionId);

    if (!session) {
        return false;
    }

    // Prevent one user from deleting another user's session
    if (session.userId !== userId) {
        return false;
    }

    return sessions.delete(sessionId);
}


module.exports = {
    createSession,
    getSession,
    deleteSession
};
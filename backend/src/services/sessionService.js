const crypto = require("crypto");

const sessions = new Map();

function createSession(language = "english") {
    const sessionId = crypto.randomUUID();

    const session = {
        id: sessionId,
        language,
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

function getSession(sessionId) {
    return sessions.get(sessionId);
}

function deleteSession(sessionId) {
    return sessions.delete(sessionId);
}

module.exports = {
    createSession,
    getSession,
    deleteSession
};
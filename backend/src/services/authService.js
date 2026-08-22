const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const SALT_ROUNDS = 12;

// Temporary in-memory user store.
// Users disappear when the backend restarts.
const users = new Map();

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

async function createUser(name, email, password) {
    const normalizedEmail = normalizeEmail(email);

    // Check whether email already exists
    for (const user of users.values()) {
        if (user.email === normalizedEmail) {
            const error = new Error(
                "An account with this email already exists."
            );

            error.statusCode = 409;
            throw error;
        }
    }

    const passwordHash = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    const user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
    };

    users.set(user.id, user);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
}

async function authenticateUser(email, password) {
    const normalizedEmail = normalizeEmail(email);

    let user = null;

    for (const storedUser of users.values()) {
        if (storedUser.email === normalizedEmail) {
            user = storedUser;
            break;
        }
    }

    if (!user) {
        return null;
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
}

function createAccessToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
            issuer: "saathi",
            audience: "saathi-users",
        }
    );
}

function verifyAccessToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
            issuer: "saathi",
            audience: "saathi-users",
        }
    );
}

async function getUserById(userId) {
    const user = users.get(userId);

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
}

module.exports = {
    createUser,
    authenticateUser,
    createAccessToken,
    verifyAccessToken,
    getUserById,
};
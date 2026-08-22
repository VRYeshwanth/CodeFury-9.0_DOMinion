const {
    createUser,
    authenticateUser,
    createAccessToken,
    getUserById,
} = require("../services/authService");

function validateRegistration(name, email, password) {
    if (!name || !email || !password) {
        return "Name, email and password are required.";
    }

    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string") {
        return "Invalid registration data.";
    }

    if (name.trim().length < 2) {
        return "Please enter a valid name.";
    }

    if (name.trim().length > 100) {
        return "Name is too long.";
    }

    if (password.length < 8) {
        return "Password must contain at least 8 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        return "Please enter a valid email address.";
    }

    return null;
}

function validateLogin(email, password) {
    if (!email || !password) {
        return "Email and password are required.";
    }

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return "Invalid login data.";
    }

    return null;
}

const cookieOptions = {
    httpOnly: true,

    // HTTPS on Render
    secure: process.env.NODE_ENV === "production",

    // Works for your local frontend/backend setup
    // and Render's same-site *.onrender.com deployment.
    sameSite: "lax",

    maxAge: 60 * 60 * 1000,

    path: "/",
};

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const validationError = validateRegistration(
            name,
            email,
            password
        );

        if (validationError) {
            return res.status(400).json({
                success: false,
                error: validationError,
            });
        }

        const user = await createUser(
            name,
            email,
            password
        );

        const token = createAccessToken(user);

        res.cookie(
            "saathi_token",
            token,
            cookieOptions
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const validationError = validateLogin(
            email,
            password
        );

        if (validationError) {
            return res.status(400).json({
                success: false,
                error: validationError,
            });
        }

        const user = await authenticateUser(
            email,
            password
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password.",
            });
        }

        const token = createAccessToken(user);

        res.cookie(
            "saathi_token",
            token,
            cookieOptions
        );

        return res.json({
            success: true,
            message: "Login successful.",
            user,
        });
    } catch (error) {
        next(error);
    }
}

async function logout(req, res, next) {
    try {
        res.clearCookie(
            "saathi_token",
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            }
        );

        return res.json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        next(error);
    }
}

async function me(req, res, next) {
    try {
        const user = await getUserById(
            req.user.userId
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User account no longer exists.",
            });
        }

        return res.json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    logout,
    me,
};
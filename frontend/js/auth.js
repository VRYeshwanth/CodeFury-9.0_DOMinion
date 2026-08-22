function authMessage(key) {
    return window.authT ? window.authT(key) : key;
}

function getAuthError(data, fallback) {
    return data?.error || data?.message || fallback;
}

async function readAuthResponse(response) {
    try {
        return await response.json();
    } catch {
        throw new Error("Invalid server response");
    }
}

function setAuthError(id, message) {
    const element = document.getElementById(id);
    if (element) element.textContent = message || "";
}

function showLoginView() {
    document.getElementById("loginView").hidden = false;
    document.getElementById("registerView").hidden = true;
    setAuthError("loginError", "");
    setAuthError("registerError", "");
    updateAuthText();
}

function showRegisterView() {
    document.getElementById("loginView").hidden = true;
    document.getElementById("registerView").hidden = false;
    setAuthError("loginError", "");
    setAuthError("registerError", "");
    updateAuthText();
}

function updateAuthText() {
    document.querySelectorAll("#authScreen [data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (window.authT) element.textContent = authT(key);
    });

    const toggle = document.getElementById("authLanguageToggle");
    if (toggle) {
        toggle.textContent = appState.language === "english" ? "ಕನ್ನಡ" : "English";
    }
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setButtonLoading(button, loading, loadingText, normalText) {
    button.disabled = loading;
    button.textContent = loading ? loadingText : normalText;
}

async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await readAuthResponse(response);
    if (!response.ok || data.success === false) {
        throw new Error(getAuthError(data, authMessage("connectionError")));
    }
    return data;
}

async function registerUser(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await readAuthResponse(response);
    if (!response.ok || data.success === false) {
        throw new Error(getAuthError(data, authMessage("connectionError")));
    }
    return data;
}

async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        // A fresh visitor is expected to receive 401.
        if (response.status === 401) {
            showUnauthenticatedApp();
            return;
        }

        if (!response.ok) {
            throw new Error("Authentication check failed");
        }

        const data = await readAuthResponse(response);

        if (!data.success || !data.user) {
            showUnauthenticatedApp();
            return;
        }

        await initializeAuthenticatedSession(data.user);
    } catch (error) {
        console.error(error);
        showUnauthenticatedApp();
        document.getElementById("authConnectionStatus").textContent =
            authMessage("connectionError");
    }
}

async function logoutUser() {
    const button = document.getElementById("logoutButton");
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
        const data = await readAuthResponse(response);

        if (!response.ok || data.success === false) {
            throw new Error(getAuthError(data, authMessage("connectionError")));
        }

        if (typeof stopSpeaking === "function") stopSpeaking();
        if (typeof stopListening === "function") stopListening();

        showUnauthenticatedApp();
    } catch (error) {
        console.error(error);
        button.disabled = false;
        setAuthError("loginError", authMessage("connectionError"));
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const button = document.getElementById("loginButton");

    setAuthError("loginError", "");

    if (!validEmail(email)) {
        setAuthError("loginError", authMessage("invalidEmail"));
        return;
    }

    if (!password) {
        setAuthError(
            "loginError",
            appState.language === "kannada"
                ? "ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ."
                : "Please enter your password."
        );
        return;
    }

    setButtonLoading(button, true, authMessage("loggingIn"), authMessage("login"));

    try {
        const data = await loginUser(email, password);
        document.getElementById("loginForm").reset();
        await initializeAuthenticatedSession(data.user);
    } catch (error) {
        console.error(error);
        setAuthError(
            "loginError",
            error.message === "Failed to fetch"
                ? authMessage("connectionError")
                : error.message
        );
    } finally {
        setButtonLoading(button, false, authMessage("loggingIn"), authMessage("login"));
    }
}

async function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmation = document.getElementById("registerConfirmPassword").value;
    const button = document.getElementById("registerButton");

    setAuthError("registerError", "");

    if (name.length < 2) {
        setAuthError("registerError", authMessage("invalidName"));
        return;
    }

    if (!validEmail(email)) {
        setAuthError("registerError", authMessage("invalidEmail"));
        return;
    }

    if (password.length < 8) {
        setAuthError("registerError", authMessage("shortPassword"));
        return;
    }

    if (password !== confirmation) {
        setAuthError("registerError", authMessage("passwordMismatch"));
        return;
    }

    setButtonLoading(
        button,
        true,
        authMessage("creatingAccount"),
        authMessage("createAccountButton")
    );

    try {
        const data = await registerUser(name, email, password);
        document.getElementById("registerForm").reset();
        await initializeAuthenticatedSession(data.user);
    } catch (error) {
        console.error(error);
        setAuthError(
            "registerError",
            error.message === "Failed to fetch"
                ? authMessage("connectionError")
                : error.message
        );
    } finally {
        setButtonLoading(
            button,
            false,
            authMessage("creatingAccount"),
            authMessage("createAccountButton")
        );
    }
}

function initializeAuth() {
    document.getElementById("showRegisterButton").addEventListener("click", showRegisterView);
    document.getElementById("showLoginButton").addEventListener("click", showLoginView);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegistration);

    document.getElementById("authLanguageToggle").addEventListener("click", () => {
        setLanguage(
            appState.language === "english"
                ? "kannada"
                : "english"
        );

        updateAuthText();
        updateUserGreeting();
    });

    showLoginView();
    updateAuthText();
    checkAuthentication();
}

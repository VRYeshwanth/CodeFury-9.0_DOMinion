const API_BASE_URL = "http://localhost:5000/api";

const appState = {
  language: "english",
  sessionId: null,
  currentFeature: "home",
};

const translations = {
  english: {
    tagline: "Your daily companion",
    welcomeEyebrow: "HELLO",
    welcomeTitle: "How can Saathi help?",
    messageFeature: "Understand a Message",
    messageFeatureHint: "Make a difficult message simple",
    upiFeature: "Practice Sending Money",
    upiFeatureHint: "Demo only — no real payment",
    emergencyFeature: "Emergency Help",
    emergencyFeatureHint: "Call someone you trust",
    back: "Back",
    messageTitle: "Understand a Message",
    messagePrompt: "Paste or type the message you received.",
    speakMessage: "Speak Message",
    messageInputLabel: "Message",
    messagePlaceholder:
      "Example: Your bank account has been debited by Rs 2000.",
    explain: "EXPLAIN",
    whatThisMeans: "WHAT THIS MEANS",
    readAloud: "READ ALOUD",
    demoOnly: "DEMO ONLY",
    noMoney: "No real money is transferred.",
    upiTitle: "Practice Sending Money",
    upiStarting: "We will guide you one step at a time.",
    upiAnswerLabel: "Your answer",
    upiPlaceholder: "Type your answer",
    speakAnswer: "Speak Answer",
    continue: "CONTINUE",
    pleaseConfirm: "PLEASE CONFIRM",
    yesConfirm: "YES, CONFIRM",
    noCancel: "NO, CANCEL",
    startAgain: "START AGAIN",
    emergencyTitle: "Need Help?",
    emergencyPrompt: "Choose someone you trust.",
    emergencyNote:
      "Your saved emergency numbers are used only when you choose to call or message them.",
    understanding: "Understanding your message...",
    messageError: "We could not understand the message. Please try again.",
    startingDemo: "Starting the demo...",
    demoError: "We could not start the demo. Please try again.",
    somethingWrong: "Something went wrong. Please try again.",
    listening: "Listening...",
    listeningFailed: "Voice input is unavailable. You can type instead.",
    completed: "DEMO COMPLETED",
    cancelled: "DEMO CANCELLED",
  },
  kannada: {
    tagline: "ನಿಮ್ಮ ದೈನಂದಿನ ಸಹಾಯಕ",
    welcomeEyebrow: "ನಮಸ್ಕಾರ",
    welcomeTitle: "ಸಾಥಿ ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    messageFeature: "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    messageFeatureHint: "ಕಷ್ಟವಾದ ಸಂದೇಶವನ್ನು ಸರಳವಾಗಿ ತಿಳಿಯಿರಿ",
    upiFeature: "ಹಣ ಕಳುಹಿಸುವ ಅಭ್ಯಾಸ",
    upiFeatureHint: "ಡೆಮೊ ಮಾತ್ರ — ನಿಜವಾದ ಪಾವತಿ ಇಲ್ಲ",
    emergencyFeature: "ತುರ್ತು ಸಹಾಯ",
    emergencyFeatureHint: "ನೀವು ನಂಬುವವರಿಗೆ ಕರೆ ಮಾಡಿ",
    back: "ಹಿಂದೆ",
    messageTitle: "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    messagePrompt: "ನಿಮಗೆ ಬಂದ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಅಂಟಿಸಿ.",
    speakMessage: "ಸಂದೇಶ ಹೇಳಿ",
    messageInputLabel: "ಸಂದೇಶ",
    messagePlaceholder: "ಉದಾಹರಣೆ: ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯಿಂದ ರೂ. 2000 ಕಡಿತವಾಗಿದೆ.",
    explain: "ಅರ್ಥಮಾಡಿಸಿ",
    whatThisMeans: "ಇದರ ಅರ್ಥ",
    readAloud: "ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
    demoOnly: "ಡೆಮೊ ಮಾತ್ರ",
    noMoney: "ಯಾವುದೇ ನಿಜವಾದ ಹಣ ವರ್ಗಾವಣೆಯಾಗುವುದಿಲ್ಲ.",
    upiTitle: "ಹಣ ಕಳುಹಿಸುವ ಅಭ್ಯಾಸ",
    upiStarting: "ನಾವು ನಿಮಗೆ ಒಂದೊಂದೇ ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ಮಾಡುತ್ತೇವೆ.",
    upiAnswerLabel: "ನಿಮ್ಮ ಉತ್ತರ",
    upiPlaceholder: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಬರೆಯಿರಿ",
    speakAnswer: "ಉತ್ತರ ಹೇಳಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    pleaseConfirm: "ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ",
    yesConfirm: "ಹೌದು, ಖಚಿತಪಡಿಸಿ",
    noCancel: "ಇಲ್ಲ, ರದ್ದುಮಾಡಿ",
    startAgain: "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ",
    emergencyTitle: "ಸಹಾಯ ಬೇಕೇ?",
    emergencyPrompt: "ನೀವು ನಂಬುವ ವ್ಯಕ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    emergencyNote:
      "ನೀವು ಕರೆ ಅಥವಾ ಸಂದೇಶ ಮಾಡಲು ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಮಾತ್ರ ನಿಮ್ಮ ತುರ್ತು ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",
    understanding: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ...",
    messageError:
      "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    startingDemo: "ಡೆಮೊ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ...",
    demoError: "ಡೆಮೊ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    somethingWrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    listening: "ಕೇಳಲಾಗುತ್ತಿದೆ...",
    listeningFailed: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.",
    completed: "ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ",
    cancelled: "ಡೆಮೊ ರದ್ದುಗೊಂಡಿದೆ",
  },
};

function t(key) {
  return (
    translations[appState.language][key] || translations.english[key] || key
  );
}

function setLanguage(language) {
  if (!["english", "kannada"].includes(language)) return;

  appState.language = language;

  document.documentElement.lang = language === "kannada" ? "kn" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  const languageButton = document.getElementById("languageToggle");
  languageButton.textContent = language === "english" ? "ಕನ್ನಡ" : "English";
  languageButton.setAttribute(
    "aria-label",
    language === "english" ? "Switch to Kannada" : "ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಿಸಿ",
  );
}

async function postJSON(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

async function getJSON(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

function showScreen(feature) {
  const screens = {
    home: document.getElementById("homeScreen"),
    message: document.getElementById("messageScreen"),
    upi: document.getElementById("upiScreen"),
    emergency: document.getElementById("emergencyScreen"),
  };

  Object.entries(screens).forEach(([name, screen]) => {
    const active = name === feature;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });

  appState.currentFeature = feature;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (feature === "message" && typeof resetMessageExplainer === "function") {
    resetMessageExplainer();
  }

  if (feature === "upi" && typeof resetUPIFlow === "function") {
    resetUPIFlow();
  }

  if (
    feature === "emergency" &&
    typeof renderEmergencyContacts === "function"
  ) {
    renderEmergencyContacts();
  }
}

function goHome() {
  if (typeof stopListening === "function") {
    stopListening();
  }

  if (typeof stopSpeaking === "function") {
    stopSpeaking();
  }

  showScreen("home");
}

function initializeApp() {
  document.getElementById("languageToggle").addEventListener("click", () => {
    setLanguage(appState.language === "english" ? "kannada" : "english");
  });

  document
    .getElementById("messageFeatureButton")
    .addEventListener("click", () => {
      showScreen("message");
    });

  document.getElementById("upiFeatureButton").addEventListener("click", () => {
    showScreen("upi");
    if (typeof initializeUPIFlow === "function") {
      initializeUPIFlow();
    }
  });

  document
    .getElementById("emergencyFeatureButton")
    .addEventListener("click", () => {
      showScreen("emergency");
    });

  document.querySelectorAll("[data-back-home]").forEach((button) => {
    button.addEventListener("click", goHome);
  });

  setLanguage("english");
  showScreen("home");
}

document.addEventListener("DOMContentLoaded", initializeApp);

const API_BASE_URL = "http://localhost:5000/api";

const appState = {
  language: sessionStorage.getItem("saathiLanguage") || "english",
  sessionId: sessionStorage.getItem("saathiSessionId") || null,
  currentFeature: "home",
};

const app = document.getElementById("app");
const languagePill = document.getElementById("languagePill");
const homeButton = document.getElementById("homeButton");
const stopSpeechButton = document.getElementById("stopSpeechButton");
const toast = document.getElementById("toast");

function t(english, kannada) {
  return appState.language === "kannada" ? kannada : english;
}

function setLanguage(language) {
  appState.language = language;
  sessionStorage.setItem("saathiLanguage", language);
  languagePill.textContent = language === "kannada" ? "ಕನ್ನಡ" : "English";
  renderHome();
}

function navigate(feature) {
  appState.currentFeature = feature;

  if (feature === "home") renderHome();
  if (feature === "message") renderMessageExplainer();
  if (feature === "upi") renderUPI();
  if (feature === "emergency") renderEmergency();
}

function goHome() {
  stopSpeaking();
  appState.currentFeature = "home";
  renderHome();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(
    () => toast.classList.remove("show"),
    3200,
  );
}

async function postJSON(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_) {
    throw new Error("Invalid server response");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

async function deleteRequest(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
  let data = {};
  try {
    data = await response.json();
  } catch (_) {}
  if (!response.ok || data.success === false) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="eyebrow">● ${t("READY TO HELP", "ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ")}</div>
      <h1>${t("Hello, I am Saathi.", "ನಮಸ್ಕಾರ, ನಾನು ಸಾಥಿ.")}</h1>
      <p>${t(
        "Choose one thing. I will guide you step by step.",
        "ಒಂದು ಕೆಲಸವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ನಾನು ಹಂತ ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.",
      )}</p>

      <div class="language-choice" aria-label="Language selection">
        <button class="lang-button ${appState.language === "english" ? "active" : ""}" id="englishLang">English</button>
        <button class="lang-button ${appState.language === "kannada" ? "active" : ""}" id="kannadaLang">ಕನ್ನಡ</button>
      </div>
    </section>

    <section class="feature-grid" aria-label="Saathi features">
      <button class="feature-card" id="messageFeature">
        <span class="feature-icon" aria-hidden="true">💬</span>
        <span>
          <h3>${t("Understand a Message", "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ")}</h3>
          <p>${t("Make a difficult SMS or bank message simple.", "ಕಷ್ಟವಾದ SMS ಅಥವಾ ಬ್ಯಾಂಕ್ ಸಂದೇಶವನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.")}</p>
        </span>
      </button>

      <button class="feature-card" id="upiFeature">
        <span class="feature-icon" aria-hidden="true">₹</span>
        <span>
          <h3>${t("Learn UPI", "UPI ಕಲಿಯಿರಿ")}</h3>
          <p>${t("Practice sending money safely. Demo only.", "ಹಣ ಕಳುಹಿಸುವುದನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ. ಡೆಮೋ ಮಾತ್ರ.")}</p>
        </span>
      </button>

      <button class="feature-card danger" id="emergencyFeature">
        <span class="feature-icon" aria-hidden="true">🚨</span>
        <span>
          <h3>${t("Need Help?", "ಸಹಾಯ ಬೇಕೇ?")}</h3>
          <p>${t("Quickly call your trusted family contact.", "ನಿಮ್ಮ ನಂಬಿಕೆಯ ಕುಟುಂಬದವರನ್ನು ತಕ್ಷಣ ಕರೆ ಮಾಡಿ.")}</p>
        </span>
      </button>
    </section>
  `;

  document.getElementById("englishLang").onclick = () => setLanguage("english");
  document.getElementById("kannadaLang").onclick = () => setLanguage("kannada");
  document.getElementById("messageFeature").onclick = () => navigate("message");
  document.getElementById("upiFeature").onclick = () => navigate("upi");
  document.getElementById("emergencyFeature").onclick = () =>
    navigate("emergency");
}

homeButton.onclick = goHome;
stopSpeechButton.onclick = stopSpeaking;

window.addEventListener("DOMContentLoaded", () => {
  languagePill.textContent =
    appState.language === "kannada" ? "ಕನ್ನಡ" : "English";
  renderHome();
});

window.Saathi = {
  appState,
  API_BASE_URL,
  t,
  setLanguage,
  navigate,
  goHome,
  showToast,
  postJSON,
  deleteRequest,
};

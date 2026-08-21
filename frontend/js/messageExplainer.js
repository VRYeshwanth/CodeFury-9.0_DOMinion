function renderMessageExplainer() {
  app.innerHTML = `
    <section class="screen">
      <button class="back-button" id="messageBack">← ${t("Back to Home", "ಮುಖ್ಯ ಪುಟಕ್ಕೆ")}</button>

      <div class="screen-header">
        <h2>${t("Understand a Message", "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ")}</h2>
        <p class="subtitle">${t(
          "Paste a message below. I will explain what it means in simple words.",
          "ಕೆಳಗೆ ಸಂದೇಶವನ್ನು ಹಾಕಿ. ಅದರ ಅರ್ಥವನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸುತ್ತೇನೆ.",
        )}</p>
      </div>

      <div class="panel">
        <label class="field-label" for="messageInput">${t("Your message", "ನಿಮ್ಮ ಸಂದೇಶ")}</label>
        <textarea id="messageInput" placeholder="${t(
          "Example: Your bank account has been debited by Rs 2000.",
          "ಉದಾಹರಣೆ: ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯಿಂದ ರೂ. 2000 ಕಡಿತವಾಗಿದೆ.",
        )}"></textarea>

        <div class="voice-row">
          <button class="voice-button" id="messageVoice">🎙 ${t("Speak", "ಮಾತನಾಡಿ")}</button>
          <button class="voice-button" id="messageClear">↺ ${t("Clear", "ಅಳಿಸಿ")}</button>
        </div>

        <button class="primary-button" id="explainButton">${t("EXPLAIN MESSAGE", "ಸಂದೇಶವನ್ನು ವಿವರಿಸಿ")}</button>
      </div>

      <div id="messageResult"></div>
    </section>
  `;

  document.getElementById("messageBack").onclick = goHome;

  const input = document.getElementById("messageInput");
  const explainButton = document.getElementById("explainButton");
  const result = document.getElementById("messageResult");

  setupVoiceButton(document.getElementById("messageVoice"), () => input);

  document.getElementById("messageClear").onclick = () => {
    input.value = "";
    input.focus();
    result.innerHTML = "";
  };

  explainButton.onclick = async () => {
    const message = input.value.trim();

    if (!message) {
      showToast(
        t(
          "Please enter a message first.",
          "ದಯವಿಟ್ಟು ಮೊದಲು ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ.",
        ),
      );
      input.focus();
      return;
    }

    explainButton.disabled = true;
    result.innerHTML = `
      <div class="loading panel">
        <div class="spinner"></div>
        ${t("Understanding your message…", "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ…")}
      </div>
    `;

    try {
      const data = await postJSON("/explain", {
        message,
        language: appState.language,
      });

      result.innerHTML = `
        <div class="result-card">
          <div class="result-label">${t("What this means", "ಇದರ ಅರ್ಥ")}</div>
          <div class="result-text" id="explanationText"></div>
          <button class="secondary-button" id="readExplanation">🔊 ${t("READ ALOUD", "ಜೋರಾಗಿ ಓದಿ")}</button>
        </div>
      `;

      document.getElementById("explanationText").textContent =
        data.explanation || "";
      document.getElementById("readExplanation").onclick = () =>
        speak(data.explanation, appState.language);

      speak(data.explanation, appState.language);
    } catch (error) {
      console.error(error);
      result.innerHTML = `
        <div class="result-card" style="background:var(--red-soft);border-color:#efc5c0;">
          <div class="result-label" style="color:var(--red);">${t("Please try again", "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ")}</div>
          <div class="result-text">${t(
            "We could not understand the message. Please try again.",
            "ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
          )}</div>
        </div>
      `;
    } finally {
      explainButton.disabled = false;
    }
  };
}

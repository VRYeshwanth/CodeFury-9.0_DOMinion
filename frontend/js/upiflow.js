let upiState = {
  step: null,
  question: null,
  transaction: null,
  busy: false,
};

function resetUPIState() {
  upiState = { step: null, question: null, transaction: null, busy: false };
}

function renderUPI() {
  resetUPIState();

  app.innerHTML = `
    <section class="screen">
      <button class="back-button" id="upiBack">← ${t("Back to Home", "ಮುಖ್ಯ ಪುಟಕ್ಕೆ")}</button>

      <div class="demo-banner">
        ⚠️ ${t("DEMO ONLY — No real money is transferred.", "ಡೆಮೋ ಮಾತ್ರ — ಯಾವುದೇ ನಿಜವಾದ ಹಣ ವರ್ಗಾವಣೆ ಆಗುವುದಿಲ್ಲ.")}
      </div>

      <div class="screen-header">
        <h2>${t("Learn UPI", "UPI ಕಲಿಯಿರಿ")}</h2>
        <p class="subtitle">${t(
          "Practice a payment step by step. Saathi will ask one question at a time.",
          "ಪಾವತಿ ಮಾಡುವುದನ್ನು ಹಂತ ಹಂತವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ. ಸಾಥಿ ಒಂದೊಂದು ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳುತ್ತದೆ.",
        )}</p>
      </div>

      <div class="question-card">
        <span class="step-badge">${t("SAFE PRACTICE", "ಸುರಕ್ಷಿತ ಅಭ್ಯಾಸ")}</span>
        <h3 class="question">${t(
          "Ready to start a UPI practice?",
          "UPI ಅಭ್ಯಾಸವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧವೇ?",
        )}</h3>
        <p class="subtitle">${t(
          "Nothing will be paid or transferred.",
          "ಯಾವುದೇ ಹಣ ಪಾವತಿಯಾಗುವುದಿಲ್ಲ ಅಥವಾ ವರ್ಗಾವಣೆಯಾಗುವುದಿಲ್ಲ.",
        )}</p>
        <button class="primary-button" id="startUPI">${t("START DEMO", "ಡೆಮೋ ಪ್ರಾರಂಭಿಸಿ")}</button>
      </div>
    </section>
  `;

  document.getElementById("upiBack").onclick = goHome;
  document.getElementById("startUPI").onclick = startUPI;
}

async function startUPI() {
  const button = document.getElementById("startUPI");
  button.disabled = true;
  button.textContent = t("Starting…", "ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ…");

  try {
    const session = await postJSON("/sessions", {
      language: appState.language,
    });
    appState.sessionId = session.sessionId;
    sessionStorage.setItem("saathiSessionId", session.sessionId);

    const data = await postJSON(
      `/sessions/${encodeURIComponent(session.sessionId)}/upi/start`,
      {},
    );
    handleUPIResponse(data);
  } catch (error) {
    console.error(error);
    showToast(
      t(
        "The demo could not start. Please try again.",
        "ಡೆಮೋ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      ),
    );
    button.disabled = false;
    button.textContent = t("START DEMO", "ಡೆಮೋ ಪ್ರಾರಂಭಿಸಿ");
  }
}

function handleUPIResponse(data) {
  if (!data) return;

  upiState.step = data.step || null;
  upiState.question = data.question || null;
  upiState.transaction = data.transaction || upiState.transaction;

  if (data.step === "recipient" || data.step === "amount") {
    renderUPIQuestion(data.step, data.question);
    if (data.question) speak(data.question, appState.language);
    return;
  }

  if (data.step === "confirmation" || data.confirmation) {
    renderUPIConfirmation(data.confirmation, data.transaction);
    speak(
      data.confirmation || buildConfirmation(data.transaction),
      appState.language,
    );
    return;
  }

  if (data.message) {
    renderUPIResult(data.message, Boolean(data.confirmed));
    speak(data.message, appState.language);
  }
}

function renderUPIQuestion(step, question) {
  const isRecipient = step === "recipient";
  const inputLabel = isRecipient
    ? t("Recipient name", "ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು")
    : t("Amount", "ಮೊತ್ತ");

  app.innerHTML = `
    <section class="screen">
      <button class="back-button" id="upiBack">← ${t("Exit Demo", "ಡೆಮೋದಿಂದ ಹೊರಬನ್ನಿ")}</button>
      <div class="demo-banner">⚠️ ${t("DEMO ONLY — No real money is transferred.", "ಡೆಮೋ ಮಾತ್ರ — ಯಾವುದೇ ನಿಜವಾದ ಹಣ ವರ್ಗಾವಣೆ ಆಗುವುದಿಲ್ಲ.")}</div>

      <div class="question-card">
        <span class="step-badge">${isRecipient ? t("STEP 1", "ಹಂತ 1") : t("STEP 2", "ಹಂತ 2")}</span>
        <h3 class="question" id="upiQuestion"></h3>

        <label class="field-label" for="upiAnswer">${inputLabel}</label>
        <input id="upiAnswer" type="text" inputmode="${isRecipient ? "text" : "decimal"}"
          autocomplete="off" placeholder="${isRecipient ? t("Example: Rahul", "ಉದಾಹರಣೆ: ರಾಹುಲ್") : t("Example: 500", "ಉದಾಹರಣೆ: 500")}" />

        <div class="voice-row">
          <button class="voice-button" id="upiVoice">🎙 ${t("Speak", "ಮಾತನಾಡಿ")}</button>
          <button class="voice-button" id="upiClear">↺ ${t("Clear", "ಅಳಿಸಿ")}</button>
        </div>

        <button class="primary-button" id="upiNext">${t("CONTINUE", "ಮುಂದುವರಿಸಿ")}</button>
      </div>
    </section>
  `;

  document.getElementById("upiQuestion").textContent = question || "";
  document.getElementById("upiBack").onclick = goHome;

  const input = document.getElementById("upiAnswer");
  setupVoiceButton(document.getElementById("upiVoice"), () => input);
  document.getElementById("upiClear").onclick = () => {
    input.value = "";
    input.focus();
  };

  document.getElementById("upiNext").onclick = () =>
    submitUPIAnswer(input.value.trim());

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitUPIAnswer(input.value.trim());
    }
  });

  setTimeout(() => input.focus(), 50);
}

async function submitUPIAnswer(answer) {
  if (!answer || !appState.sessionId || upiState.busy) {
    if (!answer)
      showToast(t("Please enter an answer.", "ದಯವಿಟ್ಟು ಉತ್ತರವನ್ನು ನಮೂದಿಸಿ."));
    return;
  }

  upiState.busy = true;
  const nextButton = document.getElementById("upiNext");
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = t("Please wait…", "ದಯವಿಟ್ಟು ಕಾಯಿರಿ…");
  }

  try {
    const data = await postJSON(
      `/sessions/${encodeURIComponent(appState.sessionId)}/upi/answer`,
      { answer },
    );
    handleUPIResponse(data);
  } catch (error) {
    console.error(error);
    showToast(
      t(
        "I could not process that answer. Please try again.",
        "ಆ ಉತ್ತರವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      ),
    );
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.textContent = t("CONTINUE", "ಮುಂದುವರಿಸಿ");
    }
  } finally {
    upiState.busy = false;
  }
}

function buildConfirmation(transaction) {
  if (!transaction) return "";
  return t(
    `You are about to send ₹${transaction.amount} to ${transaction.recipient}. Do you want to confirm?`,
    `ನೀವು ${transaction.recipient} ಅವರಿಗೆ ₹${transaction.amount} ಕಳುಹಿಸಲಿದ್ದೀರಿ. ಖಚಿತಪಡಿಸುತ್ತೀರಾ?`,
  );
}

function renderUPIConfirmation(confirmation, transaction) {
  const amount = transaction?.amount ?? "";
  const recipient = transaction?.recipient ?? "";

  app.innerHTML = `
    <section class="screen">
      <div class="demo-banner">⚠️ ${t("DEMO ONLY — No real money is transferred.", "ಡೆಮೋ ಮಾತ್ರ — ಯಾವುದೇ ನಿಜವಾದ ಹಣ ವರ್ಗಾವಣೆ ಆಗುವುದಿಲ್ಲ.")}</div>

      <div class="confirm-card">
        <span class="step-badge">${t("PLEASE CONFIRM", "ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ")}</span>
        <div class="confirm-amount">₹${amount}</div>
        <div class="confirm-recipient">${t("to", "ಗೆ")} ${escapeHTML(String(recipient))}</div>

        <p class="confirm-text" id="upiConfirmationText"></p>

        <div class="confirm-actions">
          <button class="confirm-button" id="confirmYes">✓ ${t("YES, CONFIRM", "ಹೌದು, ಖಚಿತಪಡಿಸಿ")}</button>
          <button class="cancel-button" id="confirmNo">✕ ${t("NO, CANCEL", "ಇಲ್ಲ, ರದ್ದುಮಾಡಿ")}</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("upiConfirmationText").textContent =
    confirmation || buildConfirmation(transaction);
  document.getElementById("confirmYes").onclick = () => confirmUPI(true);
  document.getElementById("confirmNo").onclick = () => confirmUPI(false);
}

async function confirmUPI(confirmed) {
  if (!appState.sessionId) return;

  const yes = document.getElementById("confirmYes");
  const no = document.getElementById("confirmNo");
  if (yes) yes.disabled = true;
  if (no) no.disabled = true;

  try {
    const data = await postJSON(
      `/sessions/${encodeURIComponent(appState.sessionId)}/upi/confirm`,
      { confirmed },
    );

    renderUPIResult(data.message || "", Boolean(data.confirmed));
    speak(data.message || "", appState.language);
  } catch (error) {
    console.error(error);
    showToast(
      t(
        "We could not complete that choice. Please try again.",
        "ಆ ಆಯ್ಕೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      ),
    );
    if (yes) yes.disabled = false;
    if (no) no.disabled = false;
  }
}

function renderUPIResult(message, completed) {
  app.innerHTML = `
    <section class="screen">
      <div class="success-card">
        <div class="success-icon">${completed ? "✓" : "↶"}</div>
        <h2>${completed ? t("Demo Completed", "ಡೆಮೋ ಪೂರ್ಣಗೊಂಡಿದೆ") : t("Demo Cancelled", "ಡೆಮೋ ರದ್ದಾಗಿದೆ")}</h2>
        <p class="result-text" id="upiResultMessage"></p>
        <p><strong>${t("No real payment was made.", "ಯಾವುದೇ ನಿಜವಾದ ಪಾವತಿ ಮಾಡಲಾಗಿಲ್ಲ.")}</strong></p>
        <button class="primary-button" id="upiAgain">${t("START AGAIN", "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ")}</button>
        <button class="secondary-button" id="upiHome">${t("BACK TO HOME", "ಮುಖ್ಯ ಪುಟಕ್ಕೆ")}</button>
      </div>
    </section>
  `;

  document.getElementById("upiResultMessage").textContent = message;
  document.getElementById("upiAgain").onclick = renderUPI;
  document.getElementById("upiHome").onclick = goHome;
}

function escapeHTML(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

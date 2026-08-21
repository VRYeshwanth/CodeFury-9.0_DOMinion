/*
  Replace these placeholder numbers with the trusted family contacts.
  Keep the numbers in this single configuration object.
*/
const EMERGENCY_CONTACTS = {
  beta: {
    name: "Beta",
    number: "+91XXXXXXXXXX",
  },
  beti: {
    name: "Beti",
    number: "+91XXXXXXXXXX",
  },
};

function renderEmergency() {
  app.innerHTML = `
    <section class="screen">
      <button class="back-button" id="emergencyBack">← ${t("Back to Home", "ಮುಖ್ಯ ಪುಟಕ್ಕೆ")}</button>

      <div class="screen-header">
        <h2>${t("Need Help?", "ಸಹಾಯ ಬೇಕೇ?")}</h2>
        <p class="subtitle">${t(
          "Choose a trusted family contact to call.",
          "ನಿಮ್ಮ ನಂಬಿಕೆಯ ಕುಟುಂಬದವರನ್ನು ಕರೆ ಮಾಡಲು ಆಯ್ಕೆ ಮಾಡಿ.",
        )}</p>
      </div>

      <div class="emergency-grid">
        ${contactButton("beta", "👨", t("Call Beta", "ಮಗನಿಗೆ ಕರೆ ಮಾಡಿ"), t("Trusted family contact", "ನಂಬಿಕೆಯ ಕುಟುಂಬದವರು"))}
        ${contactButton("beti", "👩", t("Call Beti", "ಮಗಳಿಗೆ ಕರೆ ಮಾಡಿ"), t("Trusted family contact", "ನಂಬಿಕೆಯ ಕುಟುಂಬದವರು"))}
      </div>

      <div class="helper">
        ${t(
          "Saathi does not contact anyone automatically. You choose the person and start the call.",
          "ಸಾಥಿ ಯಾರನ್ನೂ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಂಪರ್ಕಿಸುವುದಿಲ್ಲ. ನೀವು ವ್ಯಕ್ತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಕರೆ ಪ್ರಾರಂಭಿಸುತ್ತೀರಿ.",
        )}
      </div>
    </section>
  `;

  document.getElementById("emergencyBack").onclick = goHome;

  Object.keys(EMERGENCY_CONTACTS).forEach((key) => {
    const button = document.getElementById(`contact-${key}`);
    if (button) {
      button.onclick = () => callContact(key);
    }
  });
}

function contactButton(key, icon, title, subtitle) {
  return `
    <button class="contact-button" id="contact-${key}">
      <span class="contact-icon" aria-hidden="true">${icon}</span>
      <span>
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </span>
    </button>
  `;
}

function callContact(key) {
  const contact = EMERGENCY_CONTACTS[key];
  if (!contact || !contact.number || contact.number.includes("X")) {
    showToast(
      t(
        "Please add the trusted contact number in emergency.js first.",
        "ದಯವಿಟ್ಟು emergency.js ನಲ್ಲಿ ನಂಬಿಕೆಯ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಯನ್ನು ಸೇರಿಸಿ.",
      ),
    );
    return;
  }

  const confirmed = window.confirm(
    t(`Call ${contact.name}?`, `${contact.name} ಅವರಿಗೆ ಕರೆ ಮಾಡಬೇಕೇ?`),
  );

  if (!confirmed) return;

  window.location.href = `tel:${contact.number}`;
}

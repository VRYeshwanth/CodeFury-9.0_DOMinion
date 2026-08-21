/*
 * Replace these example values with the emergency contacts
 * agreed upon for the Saathi demo.
 *
 * Keep the numbers in this single configuration array so
 * they are not scattered across multiple files.
 */
const EMERGENCY_CONTACTS = [
  {
    name: "Beta",
    phone: "+91XXXXXXXXXX",
  },
  {
    name: "Beti",
    phone: "+91XXXXXXXXXX",
  },
];

function createTelLink(phone) {
  return `tel:${phone}`;
}

function createWhatsAppLink(phone, language) {
  const number = phone.replace(/\D/g, "");

  const message =
    language === "kannada"
      ? "ನನಗೆ ಸಹಾಯ ಬೇಕು. ದಯವಿಟ್ಟು ನನಗೆ ಕರೆ ಮಾಡಿ."
      : "I need help. Please call me.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function renderEmergencyContacts() {
  const container = document.getElementById("emergencyContacts");

  container.innerHTML = "";

  EMERGENCY_CONTACTS.forEach((contact) => {
    const wrapper = document.createElement("div");

    const callButton = document.createElement("button");
    callButton.type = "button";
    callButton.className = "emergency-call-button";
    callButton.innerHTML = `📞 ${escapeHTML(contact.name)}<span>${appState.language === "kannada" ? "ಕರೆ ಮಾಡಿ" : "Call"}</span>`;

    callButton.addEventListener("click", () => {
      window.location.href = createTelLink(contact.phone);
    });

    const whatsappButton = document.createElement("button");
    whatsappButton.type = "button";
    whatsappButton.className = "secondary-button";
    whatsappButton.style.marginTop = "10px";
    whatsappButton.innerHTML =
      appState.language === "kannada"
        ? "💬 WhatsApp ಸಂದೇಶ"
        : "💬 Send WhatsApp Message";

    whatsappButton.addEventListener("click", () => {
      window.open(
        createWhatsAppLink(contact.phone, appState.language),
        "_blank",
        "noopener,noreferrer",
      );
    });

    wrapper.appendChild(callButton);
    wrapper.appendChild(whatsappButton);
    container.appendChild(wrapper);
  });
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

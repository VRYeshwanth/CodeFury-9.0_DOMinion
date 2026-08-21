let activeRecognition = null;

function speechLocale(language) {
  return language === "kannada" ? "kn-IN" : "en-IN";
}

function speak(text, language = appState.language) {
  if (!("speechSynthesis" in window) || !text) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLocale(language);
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang.toLowerCase() === utterance.lang.toLowerCase()) ||
    voices.find((v) =>
      v.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase()),
    );

  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function isSpeechRecognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function listen(language = appState.language) {
  return new Promise((resolve, reject) => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      reject(new Error("Speech recognition is not supported in this browser."));
      return;
    }

    if (activeRecognition) {
      try {
        activeRecognition.abort();
      } catch (_) {}
    }

    const recognition = new Recognition();
    activeRecognition = recognition;

    recognition.lang = speechLocale(language);
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      activeRecognition = null;
      if (transcript) resolve(transcript);
      else reject(new Error("No speech detected."));
    };

    recognition.onerror = (event) => {
      activeRecognition = null;
      reject(new Error(event.error || "Speech recognition failed."));
    };

    recognition.onend = () => {
      activeRecognition = null;
    };

    try {
      recognition.start();
    } catch (error) {
      activeRecognition = null;
      reject(error);
    }
  });
}

function setupVoiceButton(button, getTextField, language = appState.language) {
  if (!button) return;

  if (!isSpeechRecognitionSupported()) {
    button.hidden = true;
    return;
  }

  button.onclick = async () => {
    button.disabled = true;
    button.textContent = t("Listening…", "ಕೇಳುತ್ತಿದೆ…");

    try {
      const text = await listen(language);
      getTextField().value = text;
      getTextField().focus();
      speak(t("I heard: ", "ನಾನು ಕೇಳಿದ್ದು: ") + text, language);
    } catch (error) {
      console.error(error);
      showToast(
        t(
          "Voice input is unavailable. You can type instead.",
          "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.",
        ),
      );
    } finally {
      button.disabled = false;
      button.textContent = t("🎙 Speak", "🎙 ಮಾತನಾಡಿ");
    }
  };
}

let activeRecognition = null;

function getSpeechLanguage(language = appState.language) {
  return language === "kannada" ? "kn-IN" : "en-IN";
}

function speak(text, language = appState.language) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getSpeechLanguage(language);
  utterance.rate = language === "kannada" ? 0.9 : 0.92;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function isSpeechRecognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function listen(language = appState.language) {
  return new Promise((resolve, reject) => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      reject(new Error("Speech recognition is not supported."));
      return;
    }

    if (activeRecognition) {
      activeRecognition.abort();
      activeRecognition = null;
    }

    const recognition = new Recognition();
    activeRecognition = recognition;

    recognition.lang = getSpeechLanguage(language);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript?.trim();

      activeRecognition = null;

      if (text) {
        resolve(text);
      } else {
        reject(new Error("No speech detected."));
      }
    };

    recognition.onerror = (event) => {
      activeRecognition = null;
      reject(new Error(event.error || "Speech recognition failed."));
    };

    recognition.onend = () => {
      activeRecognition = null;
    };

    recognition.start();
  });
}

function stopListening() {
  if (activeRecognition) {
    activeRecognition.abort();
    activeRecognition = null;
  }
}

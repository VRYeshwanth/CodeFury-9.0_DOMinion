function resetMessageExplainer() {
    const input = document.getElementById("messageInput");
    const panel = document.getElementById("explanationPanel");
    const status = document.getElementById("messageStatus");
    const explainButton = document.getElementById("explainButton");

    input.value = "";
    panel.hidden = true;
    status.textContent = "";
    explainButton.disabled = false;
}

async function explainMessage() {
    const input = document.getElementById("messageInput");
    const button = document.getElementById("explainButton");
    const status = document.getElementById("messageStatus");
    const panel = document.getElementById("explanationPanel");
    const explanationText = document.getElementById("explanationText");

    const message = input.value.trim();

    if (!message) {
        status.textContent =
            appState.language === "kannada"
                ? "ದಯವಿಟ್ಟು ಮೊದಲು ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ."
                : "Please enter a message first.";
        input.focus();
        return;
    }

    stopSpeaking();
    button.disabled = true;
    panel.hidden = true;
    status.textContent = t("understanding");

    try {
        const data = await postJSON("/explain", {
            message,
            language: appState.language
        });

        if (!data.explanation) {
            throw new Error("No explanation returned.");
        }

        explanationText.textContent = data.explanation;
        panel.hidden = false;
        status.textContent = "";

        speak(data.explanation, appState.language);
    } catch (error) {
        console.error(error);
        status.textContent = t("messageError");
    } finally {
        button.disabled = false;
    }
}

async function captureMessageByVoice() {
    const status = document.getElementById("messageStatus");

    if (!isSpeechRecognitionSupported()) {
        status.textContent = t("listeningFailed");
        return;
    }

    stopSpeaking();
    status.textContent = t("listening");

    try {
        const text = await listen(appState.language);
        document.getElementById("messageInput").value = text;
        status.textContent = "";
    } catch (error) {
        console.error(error);
        status.textContent = t("listeningFailed");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("explainButton").addEventListener(
        "click",
        explainMessage
    );

    document.getElementById("messageListenButton").addEventListener(
        "click",
        captureMessageByVoice
    );

    document.getElementById("readExplanationButton").addEventListener(
        "click",
        () => {
            const text = document.getElementById("explanationText").textContent;
            if (text) {
                speak(text, appState.language);
            }
        }
    );
});

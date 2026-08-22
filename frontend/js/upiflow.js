let upiInitialized = false;
let upiBusy = false;

function resetUPIFlow() {
    const question = document.getElementById("upiQuestion");
    const inputArea = document.getElementById("upiInputArea");
    const confirmation = document.getElementById("upiConfirmation");
    const result = document.getElementById("upiResult");
    const status = document.getElementById("upiStatus");
    const answerInput = document.getElementById("upiAnswerInput");
    const answerButton = document.getElementById("upiAnswerButton");

    question.textContent = t("upiStarting");
    inputArea.hidden = false;
    confirmation.hidden = true;
    result.hidden = true;
    status.textContent = "";
    answerInput.value = "";
    answerInput.disabled = false;
    answerButton.disabled = false;
    upiBusy = false;
}

async function initializeUPIFlow() {
    if (upiBusy) return;

    resetUPIFlow();
    upiBusy = true;

    const status = document.getElementById("upiStatus");
    const question = document.getElementById("upiQuestion");
    const inputArea = document.getElementById("upiInputArea");

    status.textContent = t("startingDemo");

    try {
        const sessionData = await postJSON("/sessions", {
            language: appState.language
        });

        appState.sessionId = sessionData.sessionId;

        if (!appState.sessionId) {
            throw new Error("No session ID returned.");
        }

        sessionStorage.setItem("saathiSessionId", appState.sessionId);

        const startData = await postJSON(
            `/sessions/${encodeURIComponent(appState.sessionId)}/upi/start`,
            {}
        );

        handleUPIResponse(startData);
        inputArea.hidden = false;
        status.textContent = "";
    } catch (error) {
        console.error(error);
        status.textContent = t("demoError");
        inputArea.hidden = true;
    } finally {
        upiBusy = false;
    }
}

function handleUPIResponse(data) {
    const question = document.getElementById("upiQuestion");
    const inputArea = document.getElementById("upiInputArea");
    const confirmation = document.getElementById("upiConfirmation");
    const confirmationText = document.getElementById("upiConfirmationText");
    const result = document.getElementById("upiResult");
    const resultMessage = document.getElementById("upiResultMessage");
    const status = document.getElementById("upiStatus");
    const answerInput = document.getElementById("upiAnswerInput");

    status.textContent = "";

    if (data.question) {
        question.textContent = data.question;
        speak(data.question, appState.language);
    }

    if (data.confirmation) {
        confirmationText.textContent = data.confirmation;
        confirmation.hidden = false;
        inputArea.hidden = true;
        result.hidden = true;
        speak(data.confirmation, appState.language);
        return;
    }

    if (data.message) {
        resultMessage.textContent = data.message;
        result.hidden = false;
        inputArea.hidden = true;
        confirmation.hidden = true;

        const completed = data.confirmed === true;
        document.getElementById("upiResultTitle").textContent =
            completed ? t("completed") : t("cancelled");

        speak(data.message, appState.language);
        return;
    }

    confirmation.hidden = true;
    result.hidden = true;
    inputArea.hidden = false;
    answerInput.focus();
}

async function submitUPIAnswer() {
    if (upiBusy || !appState.sessionId) return;

    const input = document.getElementById("upiAnswerInput");
    const button = document.getElementById("upiAnswerButton");
    const status = document.getElementById("upiStatus");
    const answer = input.value.trim();

    if (!answer) {
        status.textContent =
            appState.language === "kannada"
                ? "ದಯವಿಟ್ಟು ಉತ್ತರವನ್ನು ನಮೂದಿಸಿ."
                : "Please enter an answer.";
        input.focus();
        return;
    }

    upiBusy = true;
    button.disabled = true;
    input.disabled = true;
    status.textContent = t("understanding");

    try {
        const data = await postJSON(
            `/sessions/${encodeURIComponent(appState.sessionId)}/upi/answer`,
            { answer }
        );

        input.value = "";
        handleUPIResponse(data);
    } catch (error) {
        console.error(error);
        status.textContent = t("somethingWrong");
        input.disabled = false;
        button.disabled = false;
    } finally {
        upiBusy = false;
    }
}

async function confirmUPI(confirmed) {
    if (upiBusy || !appState.sessionId) return;

    const yesButton = document.getElementById("upiConfirmButton");
    const noButton = document.getElementById("upiCancelButton");
    const status = document.getElementById("upiStatus");

    upiBusy = true;
    yesButton.disabled = true;
    noButton.disabled = true;
    status.textContent = t("understanding");

    try {
        const data = await postJSON(
            `/sessions/${encodeURIComponent(appState.sessionId)}/upi/confirm`,
            { confirmed }
        );

        handleUPIResponse(data);
    } catch (error) {
        console.error(error);
        status.textContent = t("somethingWrong");
        yesButton.disabled = false;
        noButton.disabled = false;
    } finally {
        upiBusy = false;
    }
}

async function captureUPIAnswerByVoice() {
    const status = document.getElementById("upiStatus");

    if (!isSpeechRecognitionSupported()) {
        status.textContent = t("listeningFailed");
        return;
    }

    stopSpeaking();
    status.textContent = t("listening");

    try {
        const text = await listen(appState.language);
        document.getElementById("upiAnswerInput").value = text;
        status.textContent = "";
        await submitUPIAnswer();
    } catch (error) {
        console.error(error);
        status.textContent = t("listeningFailed");
    }
}

function restartUPI() {
    if (appState.sessionId) {
        sessionStorage.removeItem("saathiSessionId");
    }

    appState.sessionId = null;
    initializeUPIFlow();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("upiAnswerButton").addEventListener(
        "click",
        submitUPIAnswer
    );

    document.getElementById("upiListenButton").addEventListener(
        "click",
        captureUPIAnswerByVoice
    );

    document.getElementById("upiConfirmButton").addEventListener(
        "click",
        () => confirmUPI(true)
    );

    document.getElementById("upiCancelButton").addEventListener(
        "click",
        () => confirmUPI(false)
    );

    document.getElementById("upiRestartButton").addEventListener(
        "click",
        restartUPI
    );

    document.getElementById("upiAnswerInput").addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitUPIAnswer();
            }
        }
    );
});

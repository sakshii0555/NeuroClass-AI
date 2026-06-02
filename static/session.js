let recognition;
let finalText = "";
let aiInterval;

/* 📷 START CAMERA AUTOMATICALLY */
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then(stream => {
    document.getElementById("camera").srcObject = stream;
})
.catch(() => {
    alert("⚠ Please allow camera & microphone access!");
});


/* 🎤 START TEACHING */
function startRecording() {

    finalText = "";

    let status = document.getElementById("status");
    let liveText = document.getElementById("liveText");

    // 🎤 UI update
    if (status) {
        status.innerText = "🎤 Recording... AI Listening";
    }

    // 🎙 Speech Recognition
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function (event) {

        for (let i = event.resultIndex; i < event.results.length; i++) {
            let speech = event.results[i][0].transcript;
            finalText += speech + " ";
        }

        // 🧾 show live transcript
        if (liveText) {
            liveText.innerText = "🗣️ " + finalText;
        }
    };

    recognition.start();


    /* 🧠 FAKE AI ANALYSIS (LIVE UPDATES) */
    let messages = [
        "Analyzing clarity...",
        "Detecting confidence...",
        "Tracking engagement...",
        "Understanding speech flow...",
        "Evaluating teaching style..."
    ];

    let i = 0;

    aiInterval = setInterval(() => {
        if (status) {
            status.innerText = "🧠 " + messages[i % messages.length];
            i++;
        }
    }, 3000);
}


/* ⏹ END SESSION */
function stopRecording() {

    if (recognition) recognition.stop();

    clearInterval(aiInterval);

    let status = document.getElementById("status");
    if (status) {
        status.innerText = "⏹ Processing session...";
    }

    // 👉 store speech for later (optional use)
    localStorage.setItem("speechData", finalText);

    // ⏳ small delay for realism
    setTimeout(() => {
        window.location.href = "/classroom";
    }, 1500);
}
// 🧑‍🎓 STUDENT QUESTION CLICK
function askPreset(btn) {

    let student = btn.closest(".student");
    let question = btn.innerText;

    student.classList.add("raise");

    // 💬 show question
    addMessage("student", question);

    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance(question);
        window.speechSynthesis.speak(speech);

        speech.onend = () => {
            student.classList.remove("raise");
            startTeacherAnswer(question);
        };
    } else {
        student.classList.remove("raise");
        startTeacherAnswer(question);
    }
}


// 🎤 TEACHER ANSWER (FIXED + AI FEEDBACK)
function startTeacherAnswer(question) {

    showVoiceIndicator();

    // ✅ check support
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Voice not supported");
        return;
    }

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function(event) {

        let answer = event.results[0][0].transcript;

        console.log("Q:", question);
        console.log("A:", answer);

        // 💬 show teacher answer
        addMessage("teacher", answer);

        // 💾 store locally
        let history = JSON.parse(localStorage.getItem("qa") || "[]");
        history.push({ question, answer });
        localStorage.setItem("qa", JSON.stringify(history));

        // 🔥 SEND TO BACKEND FOR AI FEEDBACK
        fetch("/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ answer: answer })
        })
        .then(res => res.json())
        .then(data => {
            addMessage("ai", data.feedback);
        });

        // 🔊 confirmation
        if ('speechSynthesis' in window) {
            let reply = new SpeechSynthesisUtterance("Answer recorded");
            window.speechSynthesis.speak(reply);
        }
    };

    recognition.onerror = function() {
        console.log("Mic error");
    };
}


// 💬 ADD MESSAGE TO CHAT UI (UPDATED)
function addMessage(sender, text) {

    let chat = document.getElementById("chat-messages");
    if (!chat) return;

    let msg = document.createElement("div");

    if (sender === "student") {
        msg.className = "student-msg";
        msg.innerText = "👨‍🎓 " + text;
    }
    else if (sender === "teacher") {
        msg.className = "teacher-msg";
        msg.innerText = "👩‍🏫 " + text;
    }
    else if (sender === "ai") {
        msg.className = "ai-msg";
        msg.innerText = "🤖 " + text;
    }

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}


// ✅ FINISH SESSION
function finishDoubtSession(){
    window.location.href = "/dashboard";
}


// 🎤 VOICE INDICATOR
function showVoiceIndicator() {

    let indicator = document.createElement("div");
    indicator.id = "voice-indicator";

    indicator.innerText = "🎤 Listening... Speak now";

    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.remove();
    }, 4000);
}
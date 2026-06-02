from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# 🔐 LOGIN PAGE
@app.route("/")
def home():
    return render_template("login.html")


# 🔐 HANDLE LOGIN BUTTON
@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    # (you can add validation later)
    return redirect(url_for("session"))


# 🎥 TEACHING SESSION PAGE
@app.route("/session")
def session():
    return render_template("session.html")


# 🧠 CLASSROOM (DOUBTS)
@app.route("/classroom")
def classroom():
    return render_template("classroom.html")


# 📊 DASHBOARD
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


if __name__ == "__main__":
    app.run(debug=True)

    from flask import request, jsonify

@app.route("/evaluate", methods=["POST"])
def evaluate():

    data = request.get_json()
    answer = data.get("answer", "")

    words = answer.split()

    # 🎯 SIMPLE SCORING LOGIC
    clarity = min(len(words) // 2, 10)
    confidence = 10 if len(words) > 8 else 6
    expression = 8 if "because" in answer.lower() else 5
    content = 7 if "example" in answer.lower() else 5

    overall = (clarity + confidence + expression + content) // 4

    feedback = []

    if clarity < 5:
        feedback.append("Improve clarity")
    if confidence < 7:
        feedback.append("Be more confident")
    if "example" not in answer.lower():
        feedback.append("Add examples")

    return jsonify({
        "scores": {
            "clarity": clarity,
            "confidence": confidence,
            "expression": expression,
            "content": content,
            "overall": overall
        },
        "feedback": feedback
    })
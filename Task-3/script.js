
"use strict";

const questions = [
    {
        q: "Which HTML element loads an external JavaScript file?",
        options: ["<style>", "<script>", "<javascript>", "<link>"],
        answer: 1,
        explanation: "The script element loads JavaScript using its src attribute."
    },
    {
        q: "Which CSS feature adapts styles to different screen widths?",
        options: ["Media queries", "Comments", "Float only", "Variables only"],
        answer: 0,
        explanation: "Media queries apply CSS rules when screen conditions match."
    },
    {
        q: "Which JavaScript function requests data from an API?",
        options: ["document.write()", "fetch()", "console.clear()", "Array.sort()"],
        answer: 1,
        explanation: "fetch() makes a network request and returns a Promise."
    },
    {
        q: "What is CSS Grid mainly used for?",
        options: ["Database queries", "Two-dimensional layouts", "API requests", "JavaScript events"],
        answer: 1,
        explanation: "CSS Grid creates layouts using rows and columns."
    },
    {
        q: "Which method parses a JSON response body?",
        options: ["response.json()", "JSON.read()", "fetch.parse()", "response.convert()"],
        answer: 0,
        explanation: "response.json() reads and parses JSON data."
    }
];

const $ = id => document.getElementById(id);

let current = 0;
let score = 0;
let answered = false;

function renderQuestion() {
    const q = questions[current];

    answered = false;

    $("counter").textContent =
        `Question ${current + 1} of ${questions.length}`;

    $("score").textContent = `Score: ${score}`;
    $("progress").style.width =
        `${((current + 1) / questions.length) * 100}%`;

    $("question").textContent = q.q;
    $("feedback").textContent = "";
    $("result").hidden = true;
    $("next").disabled = true;

    $("next").textContent =
        current === questions.length - 1
            ? "See results →"
            : "Next question →";

    $("options").replaceChildren();

    q.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option";
        button.textContent = option;

        button.addEventListener("click", () => {
            chooseAnswer(index, button);
        });

        $("options").appendChild(button);
    });
}

function chooseAnswer(selected, selectedButton) {
    if (answered) return;

    answered = true;

    const q = questions[current];
    const buttons = $("options").querySelectorAll("button");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === q.answer) {
            button.classList.add("correct");
        }
    });

    if (selected === q.answer) {
        score++;

        $("feedback").textContent =
            "Correct! " + q.explanation;

        $("feedback").style.color = "#16784e";
    } else {
        selectedButton.classList.add("incorrect");

        $("feedback").textContent =
            "Not quite. " + q.explanation;

        $("feedback").style.color = "#b63838";
    }

    $("score").textContent = `Score: ${score}`;
    $("next").disabled = false;
}

function showResults() {
    $("question").textContent = "Quiz completed!";
    $("options").replaceChildren();
    $("feedback").textContent = "";

    $("result").hidden = false;

    let message = "Keep learning and try again!";

    if (score === questions.length) {
        message = "Excellent work!";
    } else if (score >= 3) {
        message = "Good job! Keep practicing.";
    }

    $("result").textContent =
        `You scored ${score} out of ${questions.length}. ${message}`;

    $("next").disabled = true;
    $("next").textContent = "Quiz completed";
    $("counter").textContent = "Results";
    $("progress").style.width = "100%";
}

$("next").addEventListener("click", () => {
    if (!answered) return;

    if (current < questions.length - 1) {
        current++;
        renderQuestion();
    } else {
        showResults();
    }
});

$("restart").addEventListener("click", () => {
    current = 0;
    score = 0;
    renderQuestion();
});

// Fetch data from the public Advice Slip API.
async function getAdvice() {
    const button = $("fetchAdvice");

    button.disabled = true;
    $("advice").textContent = "Fetching advice...";
    $("apiStatus").textContent = "Connecting to API...";

    try {
        const response = await fetch(
            "https://api.adviceslip.com/advice",
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("API request failed.");
        }

        const data = await response.json();

        if (!data.slip || !data.slip.advice) {
            throw new Error("Unexpected API response.");
        }

        $("advice").textContent = `“${data.slip.advice}”`;
        $("apiStatus").textContent =
            "Advice loaded successfully from the public API.";

    } catch (error) {
        $("advice").textContent =
            "Advice could not be loaded. Please try again.";

        $("apiStatus").textContent =
            "Check your internet connection or try again later.";

        console.error(error);

    } finally {
        button.disabled = false;
    }
}

$("fetchAdvice").addEventListener("click", getAdvice);

renderQuestion();

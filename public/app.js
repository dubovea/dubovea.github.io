import { QUIZ_DATA, COLOR_SCHEME } from "./constants.js";

let currentQuestion = 0;
let score = 0;
let userData = {};

function applyColorScheme(isDark) {
  const scheme = isDark ? COLOR_SCHEME.dark : COLOR_SCHEME.light;
  document.documentElement.style.setProperty("--bg-color", scheme.bg);
  document.documentElement.style.setProperty("--text-color", scheme.text);
  document.documentElement.style.setProperty("--primary-color", scheme.primary);
  document.documentElement.style.setProperty("--correct-color", scheme.correct);
  document.documentElement.style.setProperty("--wrong-color", scheme.wrong);
}

function initApp() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.expand();
    userData = Telegram.WebApp.initDataUnsafe?.user || {};
    applyColorScheme(Telegram.WebApp.colorScheme === "dark");

    if (userData.username) {
      document.querySelector(
        "h1"
      ).textContent = `Привет, ${userData.username}! Добро пожаловать в викторину!`;
    }
  } else {
    applyColorScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  loadQuestion();
}

function loadQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const resultElement = document.getElementById("result");
  const scoreElement = document.getElementById("score");

  resultElement.textContent = "";
  resultElement.className = "result";

  if (currentQuestion >= QUIZ_DATA.length) {
    showFinalResults(score, QUIZ_DATA.length);
    return;
  }

  const currentQuiz = QUIZ_DATA[currentQuestion];
  questionElement.textContent = currentQuiz.question;

  optionsElement.innerHTML = "";
  currentQuiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => selectOption(index);
    optionsElement.appendChild(button);
  });

  scoreElement.textContent = `Счет: ${score}`;
}

function selectOption(index) {
  const currentQuiz = QUIZ_DATA[currentQuestion];
  const resultElement = document.getElementById("result");

  if (index === currentQuiz.correct) {
    resultElement.textContent = "Правильно!";
    resultElement.classList.add("correct");
    score++;
  } else {
    resultElement.textContent = `Неверно! Правильный ответ: ${
      currentQuiz.options[currentQuiz.correct]
    }`;
    resultElement.classList.add("wrong");
  }

  currentQuestion++;
  setTimeout(loadQuestion, 1500);
}

function showFinalResults(score, total) {
  document.getElementById("question").textContent = "Викторина завершена!";
  document.getElementById("options").innerHTML = "";

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.sendData(
      JSON.stringify({
        score: score,
        total: total,
        userId: Telegram.WebApp.initDataUnsafe.user?.id,
      })
    );
    setTimeout(() => Telegram.WebApp.close(), 1000);
  }
}

window.onload = initApp;

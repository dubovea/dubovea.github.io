// Данные викторины
const quizData = [
  {
    question: "Какая столица Франции?",
    options: ["Лондон", "Париж", "Берлин", "Мадрид"],
    correct: 1,
  },
  {
    question: "Сколько планет в Солнечной системе?",
    options: ["7", "8", "9", "10"],
    correct: 1,
  },
  {
    question: "Какое самое глубокое озеро в мире?",
    options: ["Виктория", "Байкал", "Каспийское море", "Танганьика"],
    correct: 1,
  },
  {
    question: "Кто написал 'Войну и мир'?",
    options: ["Достоевский", "Толстой", "Чехов", "Тургенев"],
    correct: 1,
  },
  {
    question: "Какой химический элемент обозначается как 'Au'?",
    options: ["Серебро", "Железо", "Золото", "Алюминий"],
    correct: 2,
  },
];

let currentQuestion = 0;
let score = 0;
let userData = {};

// Инициализация приложения
function initApp() {
  // Проверяем, открыто ли в Telegram WebApp
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.expand();
    userData = Telegram.WebApp.initDataUnsafe?.user || {};

    // Если есть данные пользователя, можно их использовать
    if (userData.username) {
      document.querySelector(
        "h1"
      ).textContent = `Привет, ${userData.username}! Добро пожаловать в викторину!`;
    }
  }

  loadQuestion();
}

// Загрузка вопроса
function loadQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const resultElement = document.getElementById("result");
  const scoreElement = document.getElementById("score");

  resultElement.textContent = "";

  // В конце викторины (когда показываются результаты):

  if (currentQuestion >= quizData.length) {
    showFinalResults(score, quizData.length);
    return;
  }

  const currentQuiz = quizData[currentQuestion];
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

// Выбор варианта ответа
function selectOption(index) {
  const currentQuiz = quizData[currentQuestion];
  const resultElement = document.getElementById("result");

  if (index === currentQuiz.correct) {
    resultElement.textContent = "Правильно!";
    resultElement.style.color = "green";
    score++;
  } else {
    resultElement.textContent = `Неверно! Правильный ответ: ${
      currentQuiz.options[currentQuiz.correct]
    }`;
    resultElement.style.color = "red";
  }

  currentQuestion++;
  setTimeout(loadQuestion, 1500);
}

function showFinalResults(score, total) {
  document.getElementById("question").textContent = "Викторина завершена!";
  document.getElementById("options").innerHTML = "";

  // Отправляем данные в Telegram
  if (window.Telegram && Telegram.WebApp) {
    const data = {
      score: score,
      total: total,
      userId: Telegram.WebApp.initDataUnsafe.user?.id,
    };

    // 1. Отправляем данные боту
    Telegram.WebApp.sendData(JSON.stringify(data));

    // 2. Закрываем WebApp через 1 секунду (даём время на отправку)
    setTimeout(() => {
      Telegram.WebApp.close();
    }, 1000);
  }
}

// Запускаем приложение при загрузке страницы
window.onload = initApp;

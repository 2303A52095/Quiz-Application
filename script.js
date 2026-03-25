const defaultQuestions = [
  {
    type: "multiple",
    question: "Which HTML element is used to define the largest heading on a webpage?",
    options: ["<heading>", "<h6>", "<h1>", "<header>"],
    answer: "<h1>"
  },
  {
    type: "fill",
    question: "CSS stands for ______ Style Sheets.",
    answer: "Cascading"
  },
  {
    type: "multiple",
    question: "Which JavaScript keyword is used to declare a block-scoped variable?",
    options: ["var", "const", "let", "static"],
    answer: "let"
  },
  {
    type: "fill",
    question: "The method used to convert JSON text into a JavaScript object is ______.",
    answer: "JSON.parse()"
  },
  {
    type: "multiple",
    question: "Which CSS layout module makes it easy to align items in rows and columns?",
    options: ["Float", "Positioning", "Flexbox", "Inline-block"],
    answer: "Flexbox"
  }
];

const authShell = document.getElementById("auth-shell");
const appShell = document.getElementById("app-shell");
const showLoginButton = document.getElementById("show-login-button");
const showMentorLoginButton = document.getElementById("show-mentor-login-button");
const showSignupButton = document.getElementById("show-signup-button");
const loginPanel = document.getElementById("login-panel");
const mentorLoginPanel = document.getElementById("mentor-login-panel");
const signupPanel = document.getElementById("signup-panel");
const loginForm = document.getElementById("login-form");
const mentorLoginForm = document.getElementById("mentor-login-form");
const signupForm = document.getElementById("signup-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const mentorLoginEmailInput = document.getElementById("mentor-login-email");
const mentorLoginPasswordInput = document.getElementById("mentor-login-password");
const signupRoleInput = document.getElementById("signup-role");
const signupNameInput = document.getElementById("signup-name");
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");
const signupConfirmPasswordInput = document.getElementById("signup-confirm-password");
const loginFeedback = document.getElementById("login-feedback");
const mentorLoginFeedback = document.getElementById("mentor-login-feedback");
const signupFeedback = document.getElementById("signup-feedback");
const userGreeting = document.getElementById("user-greeting");
const logoutButton = document.getElementById("logout-button");
const studentOverview = document.getElementById("student-overview");
const mentorOverview = document.getElementById("mentor-overview");
const studentWorkspace = document.getElementById("student-workspace");
const mentorWorkspace = document.getElementById("mentor-workspace");
const studentDashboardBestScore = document.getElementById("student-dashboard-best-score");
const studentDashboardQuestionCount = document.getElementById("student-dashboard-question-count");
const studentDashboardAverageTime = document.getElementById("student-dashboard-average-time");
const mentorDashboardQuestionCount = document.getElementById("mentor-dashboard-question-count");
const mentorDashboardMultipleCount = document.getElementById("mentor-dashboard-multiple-count");
const mentorDashboardFillCount = document.getElementById("mentor-dashboard-fill-count");
const mentorDashboardMaxTime = document.getElementById("mentor-dashboard-max-time");
const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");
const timerDisplay = document.getElementById("timer");
const questionTimeLimit = document.getElementById("question-time-limit");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const timerCircle = document.getElementById("timer-circle");
const questionText = document.getElementById("question-text");
const questionTypeBadge = document.getElementById("question-type-badge");
const answerButtons = document.getElementById("answer-buttons");
const fillBlankArea = document.getElementById("fill-blank-area");
const fillBlankInput = document.getElementById("fill-blank-input");
const submitAnswerButton = document.getElementById("submit-answer-button");
const nextButton = document.getElementById("next-button");
const feedback = document.getElementById("feedback");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-button");
const questionForm = document.getElementById("question-form");
const questionTypeSelect = document.getElementById("question-type");
const questionInput = document.getElementById("question-input");
const optionsFields = document.getElementById("options-fields");
const optionA = document.getElementById("option-a");
const optionB = document.getElementById("option-b");
const optionC = document.getElementById("option-c");
const optionD = document.getElementById("option-d");
const answerInput = document.getElementById("answer-input");
const timeLimitMinutesInput = document.getElementById("time-limit-minutes");
const timeLimitSecondsInput = document.getElementById("time-limit-seconds");
const timeLimitPreview = document.getElementById("time-limit-preview");
const formFeedback = document.getElementById("form-feedback");
const resetQuestionsButton = document.getElementById("reset-questions-button");
const openManagerButton = document.getElementById("open-manager-button");
const openManagerButtonSecondary = document.getElementById("open-manager-button-secondary");
const closeManagerButton = document.getElementById("close-manager-button");
const editorModal = document.getElementById("editor-modal");
const modalBackdrop = document.getElementById("modal-backdrop");

const DEFAULT_QUESTION_TIME = 60;
const SCORE_STORAGE_KEY = "quizGameBestScore";
const QUESTIONS_STORAGE_KEY = "quizGameQuestions";
const AUTH_USERS_STORAGE_KEY = "quizGameUsers";
const AUTH_SESSION_STORAGE_KEY = "quizGameCurrentUser";
const TIMER_RADIUS = 52;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = DEFAULT_QUESTION_TIME;
let timerId = null;
let hasAnswered = false;
let currentQuestionTimeLimit = DEFAULT_QUESTION_TIME;

timerCircle.style.strokeDasharray = `${TIMER_CIRCUMFERENCE}`;

const normalizeQuestion = (question) => ({
  ...question,
  options: question.options ? [...question.options] : undefined,
  timeLimit: Number(question.timeLimit) >= 5 ? Number(question.timeLimit) : DEFAULT_QUESTION_TIME
});

const cloneDefaultQuestions = () => defaultQuestions.map(normalizeQuestion);

const normalizeEmail = (value) => value.trim().toLowerCase();
const formatDuration = (totalSeconds) => {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

const getTimeLimitFromInputs = () => {
  const minutes = Number(timeLimitMinutesInput.value);
  const seconds = Number(timeLimitSecondsInput.value);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return NaN;
  }

  return (Math.max(0, minutes) * 60) + Math.max(0, seconds);
};

const updateTimeLimitPreview = () => {
  const totalSeconds = getTimeLimitFromInputs();

  if (!Number.isFinite(totalSeconds)) {
    timeLimitPreview.textContent = "Enter a valid time for this question.";
    return;
  }

  timeLimitPreview.textContent = `Time per question: ${totalSeconds} seconds (${formatDuration(totalSeconds)})`;
};

const getStoredBestScore = () => Number(localStorage.getItem(SCORE_STORAGE_KEY)) || 0;

const storeBestScore = (value) => localStorage.setItem(SCORE_STORAGE_KEY, value);

const getStoredUsers = () => {
  const rawUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
};

const getSessionUser = () => {
  const rawUser = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
};

const setSessionUser = (user) => {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({
    name: user.name,
    email: user.email,
    role: user.role || "student"
  }));
};

const clearSessionUser = () => {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

const saveQuestions = () => {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
};

const loadQuestions = () => {
  const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);

  if (!storedQuestions) {
    questions = cloneDefaultQuestions();
    saveQuestions();
    return;
  }

  try {
    const parsedQuestions = JSON.parse(storedQuestions);
    questions = Array.isArray(parsedQuestions) && parsedQuestions.length > 0
      ? parsedQuestions.map(normalizeQuestion)
      : cloneDefaultQuestions();
  } catch (error) {
    questions = cloneDefaultQuestions();
  }
};

const normalizeAnswer = (value) => value.trim().toLowerCase();

const setAuthView = (view) => {
  loginPanel.classList.toggle("hidden", view !== "login");
  mentorLoginPanel.classList.toggle("hidden", view !== "mentor");
  signupPanel.classList.toggle("hidden", view !== "signup");
  showLoginButton.classList.toggle("auth-tab--active", view === "login");
  showMentorLoginButton.classList.toggle("auth-tab--active", view === "mentor");
  showSignupButton.classList.toggle("auth-tab--active", view === "signup");
};

const clearAuthFeedback = () => {
  loginFeedback.textContent = "";
  mentorLoginFeedback.textContent = "";
  signupFeedback.textContent = "";
};

const isMentorSession = () => getSessionUser()?.role === "mentor";

const syncAuthState = () => {
  const currentUser = getSessionUser();
  const isLoggedIn = Boolean(currentUser);
  const isMentor = currentUser?.role === "mentor";

  authShell.classList.toggle("hidden", isLoggedIn);
  appShell.classList.toggle("hidden", !isLoggedIn);

  if (!isLoggedIn) {
    userGreeting.textContent = "Signed in as Student";
    openManagerButton.classList.add("hidden");
    studentOverview.classList.remove("hidden");
    mentorOverview.classList.add("hidden");
    studentWorkspace.classList.remove("hidden");
    mentorWorkspace.classList.add("hidden");
    closeManager();
    setAuthView("login");
    return;
  }

  userGreeting.textContent = isMentor
    ? `Signed in as ${currentUser.name} (Mentor)`
    : `Signed in as ${currentUser.name}`;
  openManagerButton.classList.toggle("hidden", !isMentor);
  studentOverview.classList.toggle("hidden", isMentor);
  mentorOverview.classList.toggle("hidden", !isMentor);
  studentWorkspace.classList.toggle("hidden", isMentor);
  mentorWorkspace.classList.toggle("hidden", !isMentor);
  updateHeader();
};

const updateProgress = () => {
  const completion = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  progressBar.style.width = `${completion}%`;
  progressLabel.textContent = questions.length
    ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
    : "No questions available";
};

const updateDashboard = () => {
  const questionCount = questions.length;
  const multipleCount = questions.filter((question) => question.type === "multiple").length;
  const fillCount = questions.filter((question) => question.type === "fill").length;
  const totalTime = questions.reduce((sum, question) => sum + (question.timeLimit || DEFAULT_QUESTION_TIME), 0);
  const averageTime = questionCount ? Math.round(totalTime / questionCount) : 0;
  const maxTime = questionCount
    ? Math.max(...questions.map((question) => question.timeLimit || DEFAULT_QUESTION_TIME))
    : 0;

  studentDashboardBestScore.textContent = String(getStoredBestScore());
  studentDashboardQuestionCount.textContent = String(questionCount);
  studentDashboardAverageTime.textContent = questionCount
    ? `${averageTime}s / ${formatDuration(averageTime)}`
    : "0s";

  mentorDashboardQuestionCount.textContent = String(questionCount);
  mentorDashboardMultipleCount.textContent = String(multipleCount);
  mentorDashboardFillCount.textContent = String(fillCount);
  mentorDashboardMaxTime.textContent = questionCount
    ? `${maxTime}s / ${formatDuration(maxTime)}`
    : "0s";
};

const updateHeader = () => {
  questionCounter.textContent = questions.length ? `${currentQuestionIndex + 1} / ${questions.length}` : "0 / 0";
  scoreDisplay.textContent = score;
  bestScoreDisplay.textContent = getStoredBestScore();
  updateProgress();
  updateDashboard();
};

const updateTimerVisual = () => {
  const ratio = currentQuestionTimeLimit > 0 ? timeLeft / currentQuestionTimeLimit : 0;
  const dashOffset = TIMER_CIRCUMFERENCE * (1 - ratio);
  timerCircle.style.strokeDashoffset = `${dashOffset}`;

  if (timeLeft <= 3) {
    timerCircle.style.stroke = "var(--wrong)";
  } else if (timeLeft <= 5) {
    timerCircle.style.stroke = "var(--warning)";
  } else {
    timerCircle.style.stroke = "var(--accent)";
  }
};

const updateTimer = () => {
  timerDisplay.textContent = formatDuration(timeLeft);
  questionTimeLimit.textContent = `Limit: ${currentQuestionTimeLimit} seconds (${formatDuration(currentQuestionTimeLimit)})`;
  updateTimerVisual();
};

const stopTimer = () => {
  clearInterval(timerId);
  timerId = null;
};

const clearState = () => {
  answerButtons.innerHTML = "";
  fillBlankInput.value = "";
  fillBlankInput.disabled = false;
  fillBlankInput.classList.remove("correct", "wrong");
  submitAnswerButton.disabled = false;
  fillBlankArea.classList.add("hidden");
  feedback.textContent = "";
  nextButton.disabled = true;
  nextButton.style.visibility = "hidden";
};

const disableAnswers = () => {
  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
  });
  fillBlankInput.disabled = true;
  submitAnswerButton.disabled = true;
};

const revealCorrectAnswer = (selectedButton = null) => {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.type === "multiple") {
    Array.from(answerButtons.children).forEach((button) => {
      const isCorrect = button.dataset.correct === "true";

      if (isCorrect) {
        button.classList.add("correct");
      }

      if (selectedButton === button && !isCorrect) {
        button.classList.add("wrong");
      }
    });
    return;
  }

  const submitted = normalizeAnswer(fillBlankInput.value);
  const actual = normalizeAnswer(currentQuestion.answer);
  fillBlankInput.classList.add(submitted === actual ? "correct" : "wrong");
};

const finishQuestion = () => {
  disableAnswers();
  nextButton.disabled = false;
  nextButton.style.visibility = "visible";
};

const handleTimeOut = () => {
  hasAnswered = true;
  stopTimer();
  disableAnswers();

  const currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.type === "multiple") {
    revealCorrectAnswer();
  } else {
    fillBlankInput.value = currentQuestion.answer;
    fillBlankInput.classList.add("correct");
  }

  feedback.textContent = "Time expired. Review the correct answer and continue.";
  nextButton.disabled = false;
  nextButton.style.visibility = "visible";
};

const startTimer = () => {
  stopTimer();
  const currentQuestion = questions[currentQuestionIndex];
  currentQuestionTimeLimit = currentQuestion?.timeLimit || DEFAULT_QUESTION_TIME;
  timeLeft = currentQuestionTimeLimit;
  updateTimer();

  timerId = setInterval(() => {
    timeLeft -= 1;
    updateTimer();

    if (timeLeft <= 0) {
      handleTimeOut();
    }
  }, 1000);
};

const handleCorrectAnswer = () => {
  score += 1;
  scoreDisplay.textContent = score;
};

const selectMultipleChoiceAnswer = (event) => {
  if (hasAnswered) {
    return;
  }

  hasAnswered = true;
  stopTimer();

  const selectedButton = event.currentTarget;
  const isCorrect = selectedButton.dataset.correct === "true";

  if (isCorrect) {
    handleCorrectAnswer();
    feedback.textContent = "Correct answer. Your score has been updated.";
  } else {
    feedback.textContent = "Incorrect choice. The correct option is highlighted.";
  }

  revealCorrectAnswer(selectedButton);
  finishQuestion();
};

const submitFillBlankAnswer = () => {
  if (hasAnswered) {
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const submittedAnswer = normalizeAnswer(fillBlankInput.value);

  if (!submittedAnswer) {
    feedback.textContent = "Enter an answer before submitting.";
    return;
  }

  hasAnswered = true;
  stopTimer();

  if (submittedAnswer === normalizeAnswer(currentQuestion.answer)) {
    handleCorrectAnswer();
    fillBlankInput.classList.add("correct");
    feedback.textContent = "Correct answer. Your score has been updated.";
  } else {
    fillBlankInput.classList.add("wrong");
    feedback.textContent = `Incorrect answer. Correct answer: ${currentQuestion.answer}`;
  }

  finishQuestion();
};

const renderMultipleChoiceQuestion = (currentQuestion) => {
  answerButtons.classList.remove("hidden");
  fillBlankArea.classList.add("hidden");

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.dataset.correct = String(option === currentQuestion.answer);
    button.addEventListener("click", selectMultipleChoiceAnswer);
    answerButtons.appendChild(button);
  });
};

const renderFillBlankQuestion = () => {
  answerButtons.classList.add("hidden");
  fillBlankArea.classList.remove("hidden");
  fillBlankInput.focus();
};

const showQuestion = () => {
  if (!questions.length) {
    questionText.textContent = "No questions available. Add a new question from the manager.";
    questionTypeBadge.textContent = "Setup Required";
    clearState();
    progressLabel.textContent = "No questions available";
    timerDisplay.textContent = "--";
    questionTimeLimit.textContent = "Limit: --";
    return;
  }

  hasAnswered = false;
  clearState();
  updateHeader();

  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  questionTypeBadge.textContent = currentQuestion.type === "fill" ? "Fill in the Blank" : "Multiple Choice";

  if (currentQuestion.type === "fill") {
    renderFillBlankQuestion();
  } else {
    renderMultipleChoiceQuestion(currentQuestion);
  }

  startTimer();
};

const showResults = () => {
  stopTimer();
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScore.textContent = `${score} / ${questions.length}`;

  const bestScore = Math.max(score, getStoredBestScore());
  storeBestScore(bestScore);
  bestScoreDisplay.textContent = bestScore;
  progressBar.style.width = "100%";
  progressLabel.textContent = "Assessment complete";
  timerDisplay.textContent = "Done";
  questionTimeLimit.textContent = `Limit: ${currentQuestionTimeLimit} seconds (${formatDuration(currentQuestionTimeLimit)})`;
  timerCircle.style.strokeDashoffset = "0";
  timerCircle.style.stroke = "var(--accent)";

  if (score === questions.length) {
    resultMessage.textContent = "Outstanding result. You answered every question correctly.";
  } else if (score >= Math.ceil(questions.length / 2)) {
    resultMessage.textContent = "Strong performance. Restart the session to improve your best score.";
  } else {
    resultMessage.textContent = "The foundation is there. Restart the quiz and improve the next run.";
  }
};

const handleNextQuestion = () => {
  currentQuestionIndex += 1;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
};

const restartQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.textContent = score;
  quizScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
  showQuestion();
};

const toggleQuestionTypeFields = () => {
  const isFillBlank = questionTypeSelect.value === "fill";
  optionsFields.classList.toggle("hidden", isFillBlank);
};

const clearForm = () => {
  questionForm.reset();
  questionTypeSelect.value = "multiple";
  timeLimitMinutesInput.value = String(Math.floor(DEFAULT_QUESTION_TIME / 60));
  timeLimitSecondsInput.value = String(DEFAULT_QUESTION_TIME % 60);
  updateTimeLimitPreview();
  toggleQuestionTypeFields();
};

const addQuestion = (event) => {
  event.preventDefault();

  const type = questionTypeSelect.value;
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const minutes = Number(timeLimitMinutesInput.value);
  const seconds = Number(timeLimitSecondsInput.value);
  const timeLimit = getTimeLimitFromInputs();

  if (!question || !answer) {
    formFeedback.textContent = "Question text and correct answer are required.";
    return;
  }

  if (!Number.isFinite(minutes) || minutes < 0 || minutes > 10 || !Number.isFinite(seconds) || seconds < 0 || seconds > 60) {
    formFeedback.textContent = "Minutes must be 0 to 10 and seconds must be 0 to 60.";
    return;
  }

  if (!Number.isFinite(timeLimit) || timeLimit < 5 || timeLimit > 600) {
    formFeedback.textContent = "Time limit must be between 5 seconds and 10 minutes.";
    return;
  }

  if (type === "multiple") {
    const options = [optionA.value.trim(), optionB.value.trim(), optionC.value.trim(), optionD.value.trim()];
    const hasEmptyOption = options.some((option) => !option);

    if (hasEmptyOption) {
      formFeedback.textContent = "All four options are required for multiple-choice questions.";
      return;
    }

    if (!options.some((option) => normalizeAnswer(option) === normalizeAnswer(answer))) {
      formFeedback.textContent = "The correct answer must match one of the four options.";
      return;
    }

    questions.push(normalizeQuestion({ type, question, options, answer, timeLimit }));
  } else {
    questions.push(normalizeQuestion({ type, question, answer, timeLimit }));
  }

  saveQuestions();
  formFeedback.textContent = "Question saved successfully. Restart the quiz to include it in the session.";
  clearForm();
  updateHeader();
};

const resetQuestions = () => {
  questions = cloneDefaultQuestions();
  saveQuestions();
  currentQuestionIndex = 0;
  score = 0;
  quizScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
  formFeedback.textContent = "Question bank reset to default.";
  showQuestion();
};

const openManager = () => {
  if (!isMentorSession()) {
    return;
  }
  editorModal.classList.remove("hidden");
  editorModal.setAttribute("aria-hidden", "false");
};

const closeManager = () => {
  editorModal.classList.add("hidden");
  editorModal.setAttribute("aria-hidden", "true");
};

const handleLogin = (event) => {
  event.preventDefault();
  clearAuthFeedback();

  const email = normalizeEmail(loginEmailInput.value);
  const password = loginPasswordInput.value.trim();

  if (!email || !password) {
    loginFeedback.textContent = "Email and password are required.";
    return;
  }

  const users = getStoredUsers();
  const matchedUser = users.find((user) => (
    normalizeEmail(user.email) === email
    && user.password === password
    && (user.role || "student") === "student"
  ));

  if (!matchedUser) {
    loginFeedback.textContent = "Invalid email or password.";
    return;
  }

  setSessionUser({ ...matchedUser, role: matchedUser.role || "student" });
  loginForm.reset();
  syncAuthState();
};

const handleMentorLogin = (event) => {
  event.preventDefault();
  clearAuthFeedback();

  const email = normalizeEmail(mentorLoginEmailInput.value);
  const password = mentorLoginPasswordInput.value.trim();

  if (!email || !password) {
    mentorLoginFeedback.textContent = "Email and password are required.";
    return;
  }

  const users = getStoredUsers();
  const mentorUser = users.find((user) => (
    normalizeEmail(user.email) === email
    && user.password === password
    && user.role === "mentor"
  ));

  if (!mentorUser) {
    mentorLoginFeedback.textContent = "Invalid mentor email or password.";
    return;
  }

  setSessionUser(mentorUser);
  mentorLoginForm.reset();
  syncAuthState();
};

const handleSignup = (event) => {
  event.preventDefault();
  clearAuthFeedback();

  const role = signupRoleInput.value;
  const name = signupNameInput.value.trim();
  const email = normalizeEmail(signupEmailInput.value);
  const password = signupPasswordInput.value.trim();
  const confirmPassword = signupConfirmPasswordInput.value.trim();

  if (!name || !email || !password || !confirmPassword) {
    signupFeedback.textContent = "All fields are required to create an account.";
    return;
  }

  if (password.length < 6) {
    signupFeedback.textContent = "Password must be at least 6 characters long.";
    return;
  }

  if (password !== confirmPassword) {
    signupFeedback.textContent = "Passwords do not match.";
    return;
  }

  const users = getStoredUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    signupFeedback.textContent = "An account with this email already exists.";
    return;
  }

  const newUser = { name, email, password, role };
  users.push(newUser);
  saveUsers(users);
  setSessionUser(newUser);
  signupForm.reset();
  syncAuthState();
};

const handleLogout = () => {
  clearSessionUser();
  clearAuthFeedback();
  syncAuthState();
};

nextButton.addEventListener("click", handleNextQuestion);
restartButton.addEventListener("click", restartQuiz);
submitAnswerButton.addEventListener("click", submitFillBlankAnswer);
showLoginButton.addEventListener("click", () => {
  clearAuthFeedback();
  setAuthView("login");
});
showMentorLoginButton.addEventListener("click", () => {
  clearAuthFeedback();
  setAuthView("mentor");
});
showSignupButton.addEventListener("click", () => {
  clearAuthFeedback();
  setAuthView("signup");
});
loginForm.addEventListener("submit", handleLogin);
mentorLoginForm.addEventListener("submit", handleMentorLogin);
signupForm.addEventListener("submit", handleSignup);
logoutButton.addEventListener("click", handleLogout);
fillBlankInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitFillBlankAnswer();
  }
});
questionTypeSelect.addEventListener("change", toggleQuestionTypeFields);
questionForm.addEventListener("submit", addQuestion);
timeLimitMinutesInput.addEventListener("input", updateTimeLimitPreview);
timeLimitSecondsInput.addEventListener("input", updateTimeLimitPreview);
resetQuestionsButton.addEventListener("click", resetQuestions);
openManagerButton.addEventListener("click", openManager);
openManagerButtonSecondary.addEventListener("click", openManager);
closeManagerButton.addEventListener("click", closeManager);
modalBackdrop.addEventListener("click", closeManager);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editorModal.classList.contains("hidden")) {
    closeManager();
  }
});

loadQuestions();
bestScoreDisplay.textContent = getStoredBestScore();
toggleQuestionTypeFields();
updateTimeLimitPreview();
showQuestion();
syncAuthState();

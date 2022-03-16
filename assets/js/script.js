//select each card div by id and assign to variables
var startCard = document.getElementById("start-card");
var questionCard = document.getElementById("question-card");
var scoreCard = document.getElementById("score-card");
var leaderboardCard = document.getElementById("leaderboard-card");
var headerCard = document.querySelector("#header-card");

var quizOptions = document.getElementById("quiz-options");
var startButton = document.getElementById("start-button");
var timeDisplay = document.getElementById("time");
var score = document.getElementById("score");
var leaderboardLink = document.getElementById("leaderboard-link");
var h2QuestionElement = document.getElementById("question-text");

var resultDiv = document.getElementById("result-div");
var resultText = document.getElementById("result-text");

var submitButton = document.getElementById("submit-button");
var inputElement = document.getElementById("initials");
var alertDiv = document.getElementById("alert-div");
var alertText = document.getElementById("alert-box");

var highscoreList = document.getElementById("highscore-list");

var backButton = document.getElementById("back-button");
var clearButton = document.getElementById("clear-button");

var headerCard = document.getElementById("header-card");

var correctAudio = new Audio('./assets/audio/beep-08b.mp3');
var incorrectAudio = new Audio('./assets/audio/beep-10.mp3');

//store question text, options and answers in an array
const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", 
              "2. booleans", 
              "3. alerts", 
              "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", 
              "2. curly brackets", 
              "3. quotes", 
              "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", 
              "2. stop", 
              "3. halt", 
              "4. exit"],
    answer: "1. break",
  },
];

//variables
var currentQuestion;
var holdInterval;
var timeInterval;
var timer = 0;
var penalty = 10;

//hide all cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

timeDisplay.textContent = 0 + " second(s)";
highscoreList.setAttribute("style", "background-color: white");

//hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}

// hide alert message shows, when wrong initials enetered
function hideAlertText() {
  alertDiv.style.display = "none";
}

function startQuiz() {

  //hide any visible cards, show the question card
  hideCards();
  questionCard.removeAttribute("hidden");

  //assign 0 to currentQuestion when start button is clicked, then display the current question on the page
  currentQuestion = 0;
  displayQuestion();

  //set total time to end quiz
  timer = 75;
  displayTime();

  //executes function "countdown" every 1000ms to update time and display on page
  startTimer();

}

//display time on page
function displayTime(){
  timeDisplay.textContent = timer + " seconds";
}

// function to run the timer for the quiz
function startTimer() {
  // Sets timer
  timeInterval = setInterval(function() {
    timer--;
    displayTime();

    if (timer <= 0) {
      // Clears interval and stops timer
      clearInterval(timeInterval);
      endQuiz();
      timeDisplay.textContent = "OOOPS! OUT OF TIME!";
    }
  }, 1000);
}

//display the question and answer options for the current question
function displayQuestion() {
  var question = questions[currentQuestion];
  var options = question.options;

  h2QuestionElement.textContent = question.questionText;

  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

//Compare the text content of the option button with the answer to the current question
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

//if answer is incorrect, penalise time
function checkAnswer(eventObject) {
  var optionButton = eventObject.target;
  resultDiv.style.display = "block";

  if (optionIsCorrect(optionButton)) {

    resultText.textContent = "Correct!";
    correctAudio.play();
    setTimeout(hideResultText, 1000);

  } else {

    timer = timer - penalty;
    resultText.textContent = "Incorrect!";
    incorrectAudio.play();
    setTimeout(hideResultText, 1000);
    
    if (timer >= 10) {
      displayTime();
    } else {
      //if time is less than 10, display time as 0 and end quiz
      //time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
      timer = 0;
      displayTime();
      endQuiz();
    }
  }

  //increment current question by 1
  currentQuestion++;

  //if we have not run out of questions then display next question, else end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
    highscoreList.setAttribute("style", "background-color: #8a64e1");
  }
}

//display scorecard and hide other divs

//at end of quiz, clear the timer, hide any visible cards and display the scorecard and display the score as the remaining time
function endQuiz() {
  clearInterval(timeInterval);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = timer;
}

function storeScore(event) {
  //prevent default behaviour of form submission
  event.preventDefault();

  //check for valid input
  if (!inputElement.value) {
    alertDiv.style.display = "block";
    alertText.textContent = "Please enter your initials!!";
    alertText.setAttribute("style", "color: red");
    incorrectAudio.play();
    setTimeout(hideAlertText, 700);
    return;
  }

  //store score and initials in an object
  var leaderboardItem = {
    initials: inputElement.value,
    score: timer,
  };

  setLeaderboard(leaderboardItem);

  //hide the question card, display the leaderboardcard
  hideCards();
  leaderboardCard.removeAttribute("hidden");
  headerCard.setAttribute("style", "visibility: hidden");

  renderLeaderboard();
}

//updates the leaderboard stored in local storage
function setLeaderboard(leaderboardItem) {
  var leaderboardArray = getLeaderboard();
  inputElement.value = null;
  //append new leaderboard item to leaderboard array
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//get "leaderboardArray" from local storage (if it exists) and parse it into a javascript object using JSON.parse
function getLeaderboard() {
  var storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    var leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
  
}

//display leaderboard on leaderboard card
function renderLeaderboard() {

  var sortedLeaderboardArray = sortLeaderboard();

  highscoreList.innerHTML = "";
  for (var i = 0; i < sortedLeaderboardArray.length; i++) {
    var leaderboardEntry = sortedLeaderboardArray[i];
    var newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

//sort leaderboard array from highest to lowest
function sortLeaderboard() {
  var leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

//clear local storage and display empty leaderboard
function clearHighscores() {
  localStorage.clear();
  highscoreList.setAttribute("style", "background-color: white");
  renderLeaderboard();
}

//Hide leaderboard card show start card
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
  headerCard.setAttribute("style", "visibility: visible");
  timeDisplay.textContent = 0 + " second(s)";
  score.textContent = 0;
}

//use link to view highscores from any point on the page

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");
  headerCard.setAttribute("style", "visibility: hidden");

  //stop countdown
  clearInterval(timeInterval);

  //display leaderboard on leaderboard card
  renderLeaderboard();
}

// starts the quiz game
startButton.addEventListener("click", startQuiz);

// check for correct or incorrect answers
quizOptions.addEventListener("click", checkAnswer);

//store user initials and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

// view the high scores
leaderboardLink.addEventListener("click", showLeaderboard);

// return to the main screen
backButton.addEventListener("click", returnToStart);

// clears all the scores in the localstorage
clearButton.addEventListener("click", clearHighscores);

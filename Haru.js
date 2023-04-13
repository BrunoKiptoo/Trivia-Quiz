document.addEventListener('DOMContentLoaded', () => {
  const question1Element = document.querySelector('#question-1');
  const answer1Buttons = document.querySelectorAll('#answer-buttons-1 button');
  const nextButton = document.querySelector('#next-btn-1');
  let currentQuestionIndex = 0;
  let score = 0;
  let music = [];
  let videoGames = [];
  let currentTrivia = [];

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
  }

  fetch('http://localhost:3000/music')
  .then(response => response.json())
  .then(data => {
    music = data;
    fetch('http://localhost:3000/videoGames') // Fetch videoGames data from the videoGames URL
      .then(response => response.json())
      .then(data => {
        videoGames = data;
        // Combine music and video games trivia data
        currentTrivia = [...music, ...videoGames];
        showQuestion();
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

  function showQuestion() {
    let currentQuestion = currentTrivia[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    question1Element.innerHTML = questionNo + ". " + currentQuestion.question;

    answer1Buttons.forEach((button, index) => {
      button.innerHTML = currentQuestion.answers[index];
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
      button.removeEventListener('click', selectAnswer);
      button.addEventListener('click', selectAnswer);
    });

    nextButton.classList.add('hide');
  }
  function selectAnswer(e) {
    const selectedButton = e.target;
    const selectedAnswerIndex = parseInt(selectedButton.dataset.answerIndex);
  
    // Get the current question from the trivia data
    const currentQuestion = currentTrivia[currentQuestionIndex];
  
    // Get the index of the correct answer
    const correctAnswerIndex = currentQuestion.correctAnswer;
  
    // Check if the selected answer is correct
    if (selectedAnswerIndex === correctAnswerIndex) {
      selectedButton.classList.add('correct');
      score++;
    } else {
      selectedButton.classList.add('incorrect');
    }
  
    // Disable all answer buttons after selecting an answer
    answer1Buttons.forEach(button => {
      button.disabled = true;
    });
  
    // Show the next button after selecting an answer
    nextButton.classList.remove('hide');
  }
  

function showNextQuestion() {
currentQuestionIndex++; // Increase current question index by 1
if (currentQuestionIndex < currentTrivia.length) {
showQuestion(); // Show the next question if available
} else {
// End of trivia, show results
showResults();
}
}
function showResults() {
  // Hide the next button
  nextButton.classList.add('hide');
  // Display the score
  question1Element.innerHTML = `You scored ${score} out of ${currentTrivia.length}`;

  // Reset the quiz
  currentQuestionIndex = -1;
  score = 0;

  // Update the button text to "Play Again"
  nextButton.innerHTML = "Play Again";
  // Remove the hide class from the next button
  nextButton.classList.remove('hide');
}

// Add event listener to next button
nextButton.addEventListener('click', () => {
  if (currentQuestionIndex < currentTrivia.length - 1) {
    showNextQuestion();
  } else if (nextButton.innerHTML === "Play Again") {
    // If quiz is over and button text is "Play Again", reset quiz and change button text to "Next"
    showResults();
    nextButton.innerHTML = "Next";
  } else {
    // If quiz is over and button text is "Next", show results
    showResults();
  }
}
);





});

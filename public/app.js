const socket = io();
let questions = [];
let currentQuestionIndex = 0;
let timeLeft = 15; // Time in seconds for each question
let votes = [0, 0, 0, 0]; // Array to store votes for each choice
let currentLanguage = 'ENGLISH'; // Default language

// Translation strings for both English and French
const translations = {
    FRENCH: {
        nextRound: "Prochaine manche dans",
        timeLeft: "Temps restant:",
        correctAnswer: "La réponse est",
        votes: "votes",
    },
    ENGLISH: {
        nextRound: "Next round in",
        timeLeft: "Time left:",
        correctAnswer: "The correct answer is",
        votes: "votes",
    }
};

// Function to load questions from the JSON file
function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion(); // Display the first question
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Function to start the countdown timer
function startTimer() {
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const totalTime = timeLeft; // Store total time to calculate percentage

    const interval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `${translations[currentLanguage].timeLeft} ${timeLeft}s`;

        // Update the width of the progress bar based on the time left
        const progressPercentage = (timeLeft / totalTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            showAnswer();  // Display the correct answer when time runs out
        }
    }, 1000);
}

// Function to display the correct answer and the number of votes for each choice
function showAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.correctAnswer;
    const choicesElement = document.getElementById('choices');

    Array.from(choicesElement.children).forEach((choiceItem, index) => {
        const voteCount = votes[index];
        const choiceText = currentQuestion.choices[currentLanguage][index];

        // Display the number of votes next to each choice
        choiceItem.textContent = `${choiceText} (${voteCount} ${translations[currentLanguage].votes})`;

        // Make the correct answer blink in green
        if (index === correctAnswerIndex) {
            choiceItem.classList.add('blinking');
        }
    });

    // After 2 seconds, stop the blinking and set the color to green permanently
    setTimeout(() => {
        const correctChoiceItem = choicesElement.children[correctAnswerIndex];
        correctChoiceItem.classList.remove('blinking');
        correctChoiceItem.style.backgroundColor = '#28a745';
        correctChoiceItem.style.color = '#fff';
    }, 2000); // 2 seconds

    // Display the countdown for the next round
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${translations[currentLanguage].nextRound} 15s`;

    let countdown = 15;
    const nextRoundInterval = setInterval(() => {
        countdown--;
        timerElement.textContent = `${translations[currentLanguage].nextRound} ${countdown}s`;

        if (countdown <= 0) {
            clearInterval(nextRoundInterval);
            startNewRound();  // Start the next question
        }
    }, 1000);
}

// Function to start a new round with a random question
function startNewRound() {
    resetVotes();  // Reset votes and styles before displaying the new question
    currentQuestionIndex = Math.floor(Math.random() * questions.length); // Choose a random question
    displayQuestion(); // Display the new question

    // Notify the server to reset the votes
    socket.emit('resetVotes'); 
}

// Function to reset votes for the next question
function resetVotes() {
    votes = [0, 0, 0, 0]; // Reset the votes array
    timeLeft = 15;
    document.getElementById('timer').textContent = `${translations[currentLanguage].timeLeft} ${timeLeft}s`;

    // Reset the styles of the choices
    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = ''; // Clear previous choices
}

// Function to display the question and choices
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = `${translations[currentLanguage].question}: ${currentQuestion.question[currentLanguage]}`;

    const choicesElement = document.getElementById('choices');
    choicesElement.innerHTML = ''; // Clear previous choices

    currentQuestion.choices[currentLanguage].forEach((choice, index) => {
        const choiceItem = document.createElement('li');
        choiceItem.textContent = choice;
        choicesElement.appendChild(choiceItem);
    });

    startTimer();  // Start the timer after displaying the question
}

// Function to change the language of the interface
function changeLanguage(newLanguage) {
    currentLanguage = newLanguage;
    document.getElementById('question').textContent = translations[currentLanguage].question;
    document.getElementById('timer').textContent = `${translations[currentLanguage].timeLeft} ${timeLeft}s`;
}

// Listen for vote updates via Socket.IO without displaying results immediately
socket.on('voteUpdate', (updatedVotes) => {
    console.log('Votes updated:', updatedVotes);
    votes = [...updatedVotes];  // Update the votes locally
});

// Listen for language changes
socket.on('languageChange', (newLanguage) => {
    changeLanguage(newLanguage);
    console.log(`Language changed to ${newLanguage}`);
});

// Load questions when the page is loaded
loadQuestions();

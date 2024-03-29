// Initializing an array with the pictures names
let fruits = ["apple", "avocado", "banana", "blueberry", "coconut", "grape", "orange", "watermelon"];

let fruitsCards; //Variable for shuffled fruit cards

// Initializing matrix variables
const rows = 4;
const columns = 4;
let matrix = [];

// Initializing gameplay variables
let selectedCards = [];
let isClickable = true;
let stillPlaying = false;
let NumOfMatches, scoreValue, trials;

// Initializing time variables
let timerInfo = document.getElementById('timer-info');
let maxTime, timeLeft, timer;

// Initializing score Variables
const flipInfo = document.getElementById('flips-info');
const scoreInfo = document.getElementById('score-info');
const scoreMessage = document.querySelector('.results-message');
const gameOverlay = document.querySelector('.game-overlay');
const messageElement = document.querySelector('.message');
const scoreResult = document.querySelector('.score-result');

// Game start
window.onload = refreshGame;

// To duplicate & randomize the cards
function shuffle() {
    fruitsCards = fruits.concat(fruits);
    for (let i = fruitsCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fruitsCards[i], fruitsCards[j]] = [fruitsCards[j], fruitsCards[i]];
    }
}

// To count down specified time
function countDown() {
    if (timeLeft <= 0) {
        showResults();
        return clearInterval(timer);
    }
    timeLeft--;
    timerInfo.innerText = timeLeft;
}

// Populates the board
function initializeMatrix() {

    for (let row = 0; row < rows; row++) {
        let insertionRow = [];

        // Populate row from shuffled array
        for (let col = 0; col < columns; col++) {
            let cardImg = fruitsCards.pop();
            insertionRow.push(cardImg);

            // Assigning card properties & appending to matrix
            let card = document.createElement("img");
            card.id = row.toString() + "-" + col.toString(); // id depends on position on matrix
            card.src = "./images/" + cardImg + ".png";
            card.classList.add("card");
            document.getElementById("matrix").append(card);
        }
        matrix.push(insertionRow);
    }
    setTimeout(hideCards, 1500); // Gives time to player to see cards
}

// Replaces the cards with question mark icon
function hideCards() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            let card = document.getElementById(row.toString() + "-" + col.toString());
            card.src = "./images/question mark.png";
        }
    }
}

function selectCard() {
    // Starts time count down with first click
    if (!stillPlaying) {
        timer = setInterval(countDown, 1000);
    }

    stillPlaying = true;

    if (NumOfMatches < 8 && timeLeft > 0) {
        // To prevent selecting more than 2 cards
        if (!isClickable) {
            return;
        }

        // Info of clicked card
        let card = this;
        let [row, col] = card.id.split('-');
        let cardValue = matrix[row][col];

        // Check if the card is already matched
        if (card.classList.contains('matched')) {
            return;
        }

        // Check if the card id is different to the previously selected card
        if (selectedCards.some(selectedCard => selectedCard.card.id === card.id)) {
            return;
        }

        // Reveal the selected card
        card.src = "./images/" + cardValue + ".png";
        selectedCards.push({ card, value: cardValue });

        // Check if two cards are selected
        if (selectedCards.length === 2) {
            isClickable = false; // Disable clicking during comparison
            setTimeout(compareCards, 500);
        }
    }

}

// Compare selected cards
function compareCards() {

    let [card1, card2] = selectedCards;
    trials++;
    flipInfo.innerText = trials;

    // Check with card name
    if (card1.value === card2.value) {
        // Matched cards
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        NumOfMatches++;
        updateScore(true);

        if (NumOfMatches == 8) {
            showResults();
            clearInterval(timer); // Stop the timer
        }

    } else {
        // Not matched, hide cards again
        card1.card.src = card2.card.src = "./images/question mark.png";
        card1.card.classList.add("shake");
        card2.card.classList.add("shake");
        updateScore(false);
    }
    // To re-enable the shake effect after performing shake animation
    setTimeout(() => {
        card1.card.classList.remove("shake");
        card2.card.classList.remove("shake");
    }, 300);

    selectedCards = []; // Clear selected cards array for the next turn
    isClickable = true; // Enable clicking for the next turn
}


// Updating the score based on remaining time
function updateScore(isMatched) {
    if (isMatched) {
        if (timeLeft <= 45 && timeLeft >= 30) {
            scoreValue += 100;
        }
        else if (timeLeft < 30 && timeLeft >= 15) {
            scoreValue += 50;
        }
        else {
            scoreValue += 25;
        }
    }
    else {
        if (timeLeft <= 45 && timeLeft >= 30) {
            scoreValue -= 10;
        }
        else if (timeLeft < 30 && timeLeft >= 15) {
            scoreValue -= 15;
        }
        else {
            scoreValue -= 20;
        }
    }

    if (scoreValue < 0) {
        scoreValue = 0;
    }
    scoreInfo.innerText = scoreValue;
}

// Add event listener to the cards
function addCardEventListener() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', selectCard);
    });
}

// To show results in modal
function showResults() {
    scoreMessage.classList.remove('hidden');
    gameOverlay.classList.remove('hidden');

    if (NumOfMatches == 8) {
        saveHighestScore();
        document.querySelector('.results-message img').src = "./images/celebrate.png";
        messageElement.textContent = "Congrats!!";
    }
    else {
        document.querySelector('.results-message img').src = "./images/error.png";
        messageElement.textContent = "Time Out!!";
    }
    saveLatestScore();
    scoreResult.textContent = `Your Score : ${scoreValue}`;

}

function refreshGame() {

    // Get latest && highest score from localStorage
    document.getElementById('latest-score-info').textContent = localStorage.getItem('latestScore') || '0';
    document.getElementById('highest-score-info').textContent = localStorage.getItem('highestScore') || '0';

    // Reset variables and state
    stillPlaying = false;
    clearInterval(timer);
    maxTime = 45;
    timeLeft = maxTime;
    NumOfMatches = 0;
    scoreValue = 0;
    trials = 0;
    selectedCards = [];
    isClickable = true;

    // Clear the matrix
    document.getElementById("matrix").innerHTML = "";
    matrix = [];

    // Show result modal 
    scoreMessage.classList.add('hidden');
    gameOverlay.classList.add('hidden');
    messageElement.textContent = "";
    scoreResult.textContent = "";

    // Shuffle and re-initialize the matrix
    shuffle();
    initializeMatrix();
    setTimeout(addCardEventListener, 1500);

    // Update displays
    timerInfo.innerText = timeLeft;
    flipInfo.innerText = trials;
    scoreInfo.innerText = scoreValue;
}

function saveLatestScore() {
    // Retrieve the latest score from localStorage or default to 0
    const latestScore = parseInt(localStorage.getItem('latestScore')) || 0;

    localStorage.setItem('latestScore', scoreValue);

    document.getElementById('latest-score-info').textContent = scoreValue;
}


function saveHighestScore() {
    // Retrieve the highest score from localStorage or default to 0
    const highestScore = parseInt(localStorage.getItem('highestScore')) || 0;

    localStorage.setItem('highestScore', Math.max(highestScore, scoreValue));

    document.getElementById('highest-score-info').textContent = localStorage.getItem('highestScore');
}


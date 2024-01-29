let fruits =["apple","avocado","banana","blueberry","coconut","grape","orange","watermelon"]
let fruitsCards;

const rows = 4;
const columns = 4;
let matrix =[];

let selectedCards = [];
let isClickable = true;

let trials;

let NumOfMatches = 0;

window.onload = function() {
    trials = 0;
    shuffle();
    initializeMatrix();
    setTimeout(addCardEventListeners,2000);
}

function shuffle() {
    fruitsCards = fruits.concat(fruits);
    // console.log(fruitsCards);
    for (let i = fruitsCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fruitsCards[i], fruitsCards[j]] = [fruitsCards[j], fruitsCards[i]];
      }
    //   console.log(fruitsCards);

}

function initializeMatrix () {
    for (let row=0; row<rows ; row++)
    {
        let insertionRow=[];
        for(let col=0; col<columns ; col++) 
        {
            let cardImg = fruitsCards.pop();
            insertionRow.push(cardImg);
            let card = document.createElement("img");
            card.id = row.toString() + "-" + col.toString();
            card.src = "./images/" + cardImg + ".png";
            card.classList.add("card");
            document.getElementById("matrix").append(card);
        }
        matrix.push(insertionRow);
    }
    setTimeout(hideCards, 1500);
}

function hideCards() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            let card = document.getElementById(row.toString() + "-" + col.toString());
            card.src = "./images/question mark.png";
        }
    }
}

function selectCard() {
    if (!isClickable) {
        return;
    }
  
    let card = this;
    let [row, col] = card.id.split('-');
    let cardValue = matrix[row][col];
  
    // Check if the card is already selected or matched (add matched class when comparing cards)
    if (card.classList.contains('matched')) {
        return;
    }
    
    if (selectedCards.some(selectedCard => selectedCard.card.id === card.id)) {
        return;
    }
  
    // reveal the selected card
    card.src = "./images/" + cardValue + ".png";
    console.log(card);
    selectedCards.push({ card, value: cardValue });
    console.log(selectedCards);
  
    // Check if two cards are selected
    if (selectedCards.length === 2) {
        isClickable = false; // Disable clicking during comparison

        setTimeout(compareCards, 500); 
    }
  }

function addCardEventListeners() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', selectCard);
    });
}

function compareCards() {
    let [card1, card2] = selectedCards;
    trials++;
  
    if (card1.value === card2.value) {
        // Matched cards
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        NumOfMatches++;
        console.log(NumOfMatches);
        
        if(NumOfMatches == 8){
            console.log("Congrates!!");
        }
        
    } else {
        //Not matched, hide cards again
        card1.card.src = card2.card.src = "./images/question mark.png";
        card1.card.classList.add("shake");
        card2.card.classList.add("shake");
    }
    setTimeout(() => {
        card1.card.classList.remove("shake");
        card2.card.classList.remove("shake");
    }, 300);

    // Clear selected cards array for the next turn
    selectedCards = [];
    isClickable = true; // Enable clicking for the next turn
}

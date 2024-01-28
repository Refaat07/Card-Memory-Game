let fruits =["apple","avocado","banana","blueberry","coconut","grape","orange","watermelon"]
let fruitsCards;

const rows = 4;
const columns = 4;
let matrix =[];


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

window.onload = function() {
    shuffle();
    initializeMatrix();
}

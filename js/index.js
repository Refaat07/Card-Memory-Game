let fruits =["apple","avocado","banana","blueberry","coconut","grape","orange","watermelon"]
let fruitsCards;


function shuffle() {
    fruitsCards = fruits.concat(fruits);
    console.log(fruitsCards);
    for (let i = fruitsCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fruitsCards[i], fruitsCards[j]] = [fruitsCards[j], fruitsCards[i]];
      }
      console.log(fruitsCards);

}

window.onload = function() {
    shuffle();
}

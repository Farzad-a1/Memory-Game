// script.js
const gameBoard = document.getElementById("gameBoard");
const restartButton = document.getElementById("restart");

const icons = ["🍎", "🍌", "🍒", "🍇", "🍋", "🍉", "🥝", "🍑"];
let cards = [...icons, ...icons]; // Duplicate icons for pairs
let flippedCards = [];
let matchedPairs = 0;

// Shuffle cards using Fisher-Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create card elements
function createCard(icon) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">${icon}</div>
    </div>
  `;

  card.addEventListener("click", () => flipCard(card, icon));
  return card;
}

// Flip card and check for matches
function flipCard(card, icon) {
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  card.classList.add("flipped");
  flippedCards.push({ card, icon });

  if (flippedCards.length === 2) {
    setTimeout(checkForMatch, 800);
  }
}

// Check if two flipped cards are a match
function checkForMatch() {
  const [first, second] = flippedCards;

  if (first.icon === second.icon) {
    matchedPairs++;
    if (matchedPairs === icons.length) {
      setTimeout(() => alert("You won!"), 500);
    }
  } else {
    first.card.classList.remove("flipped");
    second.card.classList.remove("flipped");
  }

  flippedCards = [];
}

// Initialize the game
function initGame() {
  gameBoard.innerHTML = "";
  matchedPairs = 0;
  flippedCards = [];
  cards = shuffle(cards);
  cards.forEach(icon => gameBoard.appendChild(createCard(icon)));
}

// Restart game
restartButton.addEventListener("click", initGame);

// Start game on load
initGame();

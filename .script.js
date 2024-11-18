// script.js
class MemoryGame {
  constructor(gameBoardId, restartButtonId) {
    this.gameBoard = document.getElementById(gameBoardId);
    this.restartButton = document.getElementById(restartButtonId);

    this.icons = ["🍎", "🍌", "🍒", "🍇", "🍋", "🍉", "🥝", "🍑"];
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.isBusy = false;

    this.restartButton.addEventListener("click", () => this.initGame());
    this.initGame();
  }

  // Shuffle cards using Fisher-Yates shuffle
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create card element
  createCard(icon) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${icon}</div>
      </div>
    `;

    card.addEventListener("click", () => this.flipCard(card, icon));
    return card;
  }

  // Flip card and handle game logic
  flipCard(card, icon) {
    if (this.isBusy || card.classList.contains("flipped") || this.flippedCards.length === 2) return;

    card.classList.add("flipped");
    this.flippedCards.push({ card, icon });

    if (this.flippedCards.length === 2) {
      this.isBusy = true; // Block further interactions during animation
      setTimeout(() => this.checkForMatch(), 800);
    }
  }

  // Check if two flipped cards are a match
  checkForMatch() {
    const [first, second] = this.flippedCards;

    if (first.icon === second.icon) {
      this.matchedPairs++;
      if (this.matchedPairs === this.icons.length) {
        setTimeout(() => alert("You won!"), 500);
      }
    } else {
      first.card.classList.remove("flipped");
      second.card.classList.remove("flipped");
    }

    this.flippedCards = [];
    this.isBusy = false;
  }

  // Initialize the game
  initGame() {
    this.gameBoard.innerHTML = "";
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isBusy = false;

    this.cards = this.shuffle([...this.icons, ...this.icons]);
    this.cards.forEach(icon => this.gameBoard.appendChild(this.createCard(icon)));
  }
}

// Instantiate the MemoryGame class
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame("gameBoard", "restart");
});

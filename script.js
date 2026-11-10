"use strict";

const CARD_SYMBOLS = ["🍓", "🌼", "🍋", "🍄", "🌈", "🐝", "🍊", "🌷"];
const board = document.querySelector("#board");
const movesLabel = document.querySelector("#moves");
const timerLabel = document.querySelector("#timer");
const matchedLabel = document.querySelector("#matched");
const statusLabel = document.querySelector("#game-status");
const restartButton = document.querySelector("#restart");
const overlay = document.querySelector("#win-overlay");
const playAgainButton = document.querySelector("#play-again");
const finalMovesLabel = document.querySelector("#final-moves");
const finalTimeLabel = document.querySelector("#final-time");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let elapsedSeconds = 0;
let timerId = null;
let hasStarted = false;
let mismatchTimeout = null;

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function startTimer() {
  if (hasStarted) return;
  hasStarted = true;
  timerId = window.setInterval(() => {
    elapsedSeconds += 1;
    timerLabel.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function makeCard(symbol, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", `Card ${index + 1}, face down`);
  card.setAttribute("aria-pressed", "false");
  card.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back" aria-hidden="true"></span>
      <span class="card-face card-front" aria-hidden="true">${symbol}</span>
    </span>`;
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function renderBoard() {
  const deck = shuffle([...CARD_SYMBOLS, ...CARD_SYMBOLS]);
  board.replaceChildren(...deck.map(makeCard));
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("is-matched")) return;
  startTimer();
  card.classList.add("is-flipped");
  card.setAttribute("aria-pressed", "true");
  card.setAttribute("aria-label", `Card showing ${card.dataset.symbol}`);

  if (!firstCard) {
    firstCard = card;
    statusLabel.textContent = "Now find its match ✦";
    return;
  }

  secondCard = card;
  moves += 1;
  movesLabel.textContent = String(moves);
  checkForMatch();
}

function checkForMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    matchedLabel.textContent = String(matchedPairs);
    statusLabel.textContent = matchedPairs === CARD_SYMBOLS.length ? "Every little match found ✦" : "A match! Pick two more ✦";
    resetTurn();
    if (matchedPairs === CARD_SYMBOLS.length) finishGame();
    return;
  }

  lockBoard = true;
  statusLabel.textContent = "Not quite—try another pair ✦";
  mismatchTimeout = window.setTimeout(() => {
    [firstCard, secondCard].forEach((card) => {
      card.classList.remove("is-flipped");
      card.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-label", `Card ${Array.from(board.children).indexOf(card) + 1}, face down`);
    });
    resetTurn();
  }, 850);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function finishGame() {
  window.clearInterval(timerId);
  timerId = null;
  finalMovesLabel.textContent = `${moves} ${moves === 1 ? "move" : "moves"}`;
  finalTimeLabel.textContent = formatTime(elapsedSeconds);
  overlay.hidden = false;
  playAgainButton.focus();
}

function restartGame() {
  if (timerId !== null) window.clearInterval(timerId);
  if (mismatchTimeout !== null) window.clearTimeout(mismatchTimeout);
  timerId = null;
  mismatchTimeout = null;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  elapsedSeconds = 0;
  hasStarted = false;
  movesLabel.textContent = "0";
  matchedLabel.textContent = "0";
  timerLabel.textContent = "00:00";
  statusLabel.textContent = "Pick a card to get started ✦";
  overlay.hidden = true;
  renderBoard();
}

restartButton.addEventListener("click", restartGame);
playAgainButton.addEventListener("click", restartGame);
renderBoard();


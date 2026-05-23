const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

let currentPlayer = "X";
let gameActive = true;
let gameMode = "friend";

let xScore = 0;
let oScore = 0;

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function setMode(mode) {
  gameMode = mode;
  restartGame();
}

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = clickedCell.getAttribute("data-index");

  if (gameState[clickedIndex] !== "" || !gameActive) {
    return;
  }

  makeMove(clickedIndex, currentPlayer);

  if (gameMode === "computer" && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;

  checkWinner();
}

function computerMove() {
  let emptyCells = [];

  gameState.forEach((cell, index) => {
    if (cell === "") {
      emptyCells.push(index);
    }
  });

  if (emptyCells.length === 0) return;

  const randomIndex =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  makeMove(randomIndex, "O");
}

function checkWinner() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;

    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;

      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");

      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;

    if (currentPlayer === "X") {
      xScore++;
      xScoreEl.textContent = xScore;
    } else {
      oScore++;
      oScoreEl.textContent = oScore;
    }

    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "Game Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function restartGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartGame);
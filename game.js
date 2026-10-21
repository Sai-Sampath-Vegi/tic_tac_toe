const r = require("raylib");
const board = require("./board");

function getPlayerChoice(movesCount, playerChoices) { return playerChoices[movesCount % 2 + 1]; }

function toAscii(char) { return char.charCodeAt(0); }

function updateUserInput(keyPressed, world) {
  if (!world.gameState.isPlaying) return;

  if (
    keyPressed >= toAscii("0") && keyPressed <= toAscii("9") ||
    keyPressed === toAscii(world.position.delimiter)
  ) {
    world.position.input += String.fromCharCode(keyPressed);
  }

  if (keyPressed === r.KEY_BACKSPACE) {
    world.position.input = world.position.input.slice(0, -1);
  }
}

function makeMove(world) {
  const positions = world.position.input.split(world.position.delimiter);

  if (
    (positions.length === 2) &&
    ((positions[0].length > 0) && (positions[1].length > 0))
  ) {
    const row = parseInt(positions[0]) - 1;
    const col = parseInt(positions[1]) - 1;

    if (
      !(row < 0 || col < 0 ||
        row >= world.board.boardLength || col >= world.board.boardLength) &&
      !world.board.gameBoard[row][col]
    ) {
      world.board.gameBoard[row][col] =
        getPlayerChoice(world.gameState.movesCount, world.playerChoices);
      world.gameState.movesCount++;
    }
  }

  world.position.input = "";
}

function getPlayingStatus(movesCount, boardLength, isPlaying) {
  return movesCount === (boardLength * boardLength) ? false : isPlaying;
}

function resetGameState(world) {
  world.board.gameBoard = board.clearBoard(world.board.gameBoard, world.board.boardLength);
  world.gameState.movesCount = 0;
  world.gameState.isPlaying = true;
  world.gameState.playerWon = false;
}

function anyRowsMatching(gameBoard, currentPlayerChoice) {
  let playerWon = false;

  for (const row of gameBoard) {
    playerWon = true;

    for (const col of row) {
      if (col !== currentPlayerChoice) playerWon = false;
    }

    if (playerWon) return true;
  }

  return false;
}

function anyColsMatching(gameBoard, boardLength, currentPlayerChoice) {
  let playerWon = false;

  for (let row = 0; row < boardLength; row++) {
    playerWon = true;

    for (let col = 0; col < boardLength; col++) {
      if (gameBoard[col][row] !== currentPlayerChoice) playerWon = false;
    }

    if (playerWon) return true;
  }

  return false;
}

function getDiagonals(boardLength) {
  const diagonals = [[], []];

  for (let i = 0; i < boardLength; i++) {
    diagonals[0].push({ row: i, col: i });
    diagonals[1].push({ row: i, col: boardLength - i - 1 });
  }

  return diagonals;
}

function anyDiagonalsMatching(gameBoard, boardLength, currentPlayerChoice) {
  const diagonals = getDiagonals(boardLength);
  let playerWon = false;

  for (let i = 0; i < 2; i++) {
    playerWon = true;

    for (let j = 0; j < diagonals[i].length; j++) {
      const row = diagonals[i][j].row;
      const col = diagonals[i][j].col;

      if (gameBoard[row][col] !== currentPlayerChoice) playerWon = false;
    }

    if (playerWon) return true;
  }

  return false;
}

function isGameOver(world) {
  const currentPlayer = world.gameState.movesCount % 2;
  const currentPlayerChoice = world.playerChoices[Math.abs(currentPlayer - 1) + 1];
  const playerWon = { playerWon: true, gameTie: false };
  const gameTie = { playerWon: false, gameTie: true };
  const gameNotOver = { playerWon: false, gameTie: false };

  if (anyRowsMatching(world.board.gameBoard, currentPlayerChoice)) return playerWon;

  if (anyColsMatching(world.board.gameBoard, world.board.boardLength, currentPlayerChoice)) return playerWon;

  if (anyDiagonalsMatching(world.board.gameBoard, world.board.boardLength, currentPlayerChoice)) return playerWon;

  if (world.gameState.movesCount === (world.board.boardLength * world.board.boardLength)) return gameTie;

  return gameNotOver;
}

module.exports = {
  updateUserInput,
  makeMove,
  getPlayingStatus,
  resetGameState,
  isGameOver,
};

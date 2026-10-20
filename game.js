const r = require("raylib");

function getPlayerChar(movesCount, player1Choice, player2Choice) { return movesCount % 2 === 0 ? player1Choice : player2Choice; }

function toAscii(char) { return char.charCodeAt(0); }

function updatePosition(keyPressed, world) {
  if (!world.isPlaying) return;

  if (keyPressed >= toAscii("0") && keyPressed <= toAscii("9") || keyPressed === toAscii(world.positionDelimiter)) {
    world.position += String.fromCharCode(keyPressed);
  }

  if (keyPressed === r.KEY_BACKSPACE) {
    world.position = world.position.slice(0, -1);
  }
}

function makeMove(world) {
  const positions = world.position.split(world.positionDelimiter);

  if ((positions.length === 2) && ((positions[0].length > 0) && (positions[1].length > 0))) {
    const row = parseInt(positions[0]) - 1;
    const col = parseInt(positions[1]) - 1;

    if (!(row < 0 || col < 0 || row >= world.boardLength || col >= world.boardLength) && !world.board[row][col]) {
      world.board[row][col] = getPlayerChar(world.movesCount, world.player1Choice, world.player2Choice);
      world.movesCount++;
    }
  }

  world.position = "";
}

function updatePlayingStatus(movesCount, boardLength, isPlaying) {
  return movesCount === (boardLength * boardLength) ? false : isPlaying;
}

function resetGameState(world) {
  world.board = clearBoard(world.board, world.boardLength);
  world.movesCount = 0;
  world.isPlaying = true;
  world.playerWon = false;
}

function anyRowsMatching(board, currentPlayerChoice) {
  let playerWon = false;

  for (const row of board) {
    playerWon = true;

    for (const col of row) {
      if (col !== currentPlayerChoice) playerWon = false;
    }

    if (playerWon) return true;
  }

  return false;
}

function anyColsMatching(board, boardLength, currentPlayerChoice) {
  let playerWon = false;

  for (let row = 0; row < boardLength; row++) {
    playerWon = true;

    for (let col = 0; col < boardLength; col++) {
      if (board[col][row] !== currentPlayerChoice) playerWon = false;
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

function anyDiagonalsMatching(board, boardLength, currentPlayerChoice) {
  const diagonals = getDiagonals(boardLength);
  let playerWon = false;

  for (let i = 0; i < 2; i++) {
    playerWon = true;

    for (let j = 0; j < diagonals[i].length; j++) {
      const row = diagonals[i][j].row;
      const col = diagonals[i][j].col;

      if (board[row][col] !== currentPlayerChoice) playerWon = false;
    }

    if (playerWon) return true;
  }

  return false;
}

function isGameOver(world) {
  const currentPlayerChoice = world.movesCount % 2 === 1 ? world.player1Choice : world.player2Choice;

  if (anyRowsMatching(world.board, currentPlayerChoice)) return true;

  if (anyColsMatching(world.board, world.boardLength, currentPlayerChoice)) return true;

  if (anyDiagonalsMatching(world.board, world.boardLength, currentPlayerChoice)) return true;

  return false;
}

module.exports = {
  updatePosition,
  makeMove,
  updatePlayingStatus,
  resetGameState,
  isGameOver,
};

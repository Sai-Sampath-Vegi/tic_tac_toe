const r = require("raylib");

function createBoard(boardLength) {
  const gameBoard = [];

  for (let i = 0; i < boardLength; i++) {
    const row = [];
    for (let j = 0; j < boardLength; j++) {
      row.push("");
    }

    gameBoard.push(row);
  }

  return { gameBoard, boardLength };
}

function clearBoard(gameBoard, boardLength) {
  for (let row = 0; row < boardLength; row++) {
    for (let col = 0; col < boardLength; col++) {
      gameBoard[row][col] = "";
    }
  }

  return gameBoard;
}

function drawBoard(texture) {
  const textureSource = { x: 0, y: 0, width: texture.width, height: -texture.height };
  const texturePosition = { x: 0, y: 0 };

  r.DrawTextureRec(texture, textureSource, texturePosition, r.WHITE);
}

module.exports = {
  createBoard,
  clearBoard,
  drawBoard,
};

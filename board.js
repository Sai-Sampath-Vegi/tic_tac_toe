const r = require("raylib");

function createBoard(boardLength) {
  const board = [];

  for (let i = 0; i < boardLength; i++) {
    const row = [];
    for (let j = 0; j < boardLength; j++) {
      row.push("");
    }

    board.push(row);
  }

  return board;
}

function clearBoard(board, boardLength) {
  for (let row = 0; row < boardLength; row++) {
    for (let col = 0; col < boardLength; col++) {
      board[row][col] = "";
    }
  }

  return board;
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

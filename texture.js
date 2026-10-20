const r = require("raylib");

function createTexture(pixel, boardLength) {
  const textureWidth = (boardLength + 1) * pixel.width;
  const textureHeight = (boardLength + 1) * pixel.height;

  const target = r.LoadRenderTexture(textureWidth, textureHeight);

  return target;
}

function drawLineNumbers(boardLength, pixel, offset) {
  for (let j = 1; j <= boardLength; j++) {
    const x = j * pixel.width + offset;
    r.DrawText(String(j), x, pixel.lineThickness, pixel.textSize, pixel.color);
  }

  for (let i = 1; i <= boardLength; i++) {
    const y = i * pixel.height + offset;
    r.DrawText(String(i), pixel.lineThickness, y, pixel.textSize, pixel.color);
  }
}

function drawBoard(boardLength, pixel, board, offset) {
  for (let i = 1; i <= boardLength; i++) {
    for (let j = 1; j <= boardLength; j++) {
      const x = j * pixel.width;
      const y = i * pixel.height;

      const rect = { x, y, width: pixel.width, height: pixel.height, };

      r.DrawRectangleLinesEx(rect, pixel.lineThickness, pixel.color);
      r.DrawText(String(board[i - 1][j - 1]), x + offset, y + offset, pixel.textSize, pixel.color);
    }
  }
}

function updateTexture(target, board, boardLength, pixel) {
  const offset = ((pixel.width - pixel.textSize) - pixel.lineThickness);

  r.BeginTextureMode(target);
  r.ClearBackground(r.BLACK);

  drawLineNumbers(boardLength, pixel, offset);
  drawBoard(boardLength, pixel, board, offset);

  r.EndTextureMode();

  return target;
}

module.exports = {
  createTexture,
  updateTexture,
};

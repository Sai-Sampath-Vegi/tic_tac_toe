const r = require("raylib");

function running() { return !r.WindowShouldClose(); }

function teardown(world) {
  r.UnloadRenderTexture(world.target);
  r.CloseWindow();
}

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

function createTexture(pixel, boardLength) {
  const textureWidth = (boardLength + 1) * pixel.width;
  const textureHeight = (boardLength + 1) * pixel.height;

  const target = r.LoadRenderTexture(textureWidth, textureHeight);

  return target;
}

function createScreen(width, height, title) { return { width, height, title }; }

function createPixel(width, height, lineThickness, textSize, color) { return { width, height, lineThickness, textSize, color }; }

function init() {
  const screen = createScreen(400, 400, "Tic Tac Toe");
  const pixel = createPixel(50, 50, 5, 30, r.WHITE);
  const boardLength = 3;
  const board = createBoard(boardLength);
  const text = "";

  return { screen, pixel, board, boardLength, text };
}

function setup() {
  const world = init();

  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(world.screen.width, world.screen.height, world.screen.title);
  r.SetTargetFPS(60);

  const target = createTexture(world.pixel, world.boardLength);
  world.target = target;
  world.texture = target.texture;

  return world;
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

function update(world) {
  updateTexture(world.target, world.board, world.boardLength, world.pixel);

  const keyPressed = r.GetKeyPressed();

  if (keyPressed) {
    world.text += String.fromCharCode(keyPressed);
  }
}

function draw(world) {
  const textureSource = { x: 0, y: 0, width: world.texture.width, height: -world.texture.height };
  const texturePosition = { x: 0, y: 0 };

  r.BeginDrawing();
  r.ClearBackground(r.BLACK);

  r.DrawTextureRec(world.texture, textureSource, texturePosition, r.WHITE);
  r.DrawText(world.text, 0, 0, 30, r.WHITE);

  r.EndDrawing();
}

module.exports = {
  running,
  setup,
  update,
  draw,
  teardown,
}

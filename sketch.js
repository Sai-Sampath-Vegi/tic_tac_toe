const r = require("raylib");
const texture = require("./texture");
const game = require("./game");
const board = require("./board");

function running() { return !r.WindowShouldClose(); }

function teardown(world) {
  r.UnloadRenderTexture(world.target);
  r.CloseWindow();
}

function createScreen(width, height, title) { return { width, height, title }; }

function createPixel(width, height, lineThickness, textSize, color) { return { width, height, lineThickness, textSize, color }; }

function init() {
  const screen = createScreen(400, 400, "Tic Tac Toe");
  const pixel = createPixel(50, 50, 2.5, 30, r.WHITE);
  const boardLength = 3;
  const position = "";
  const positionDelimiter = "-";
  const player1Choice = "X";
  const player2Choice = "O";
  const movesCount = 0;
  const isPlaying = true;
  const playerWon = false;

  return { screen, pixel, board: board.createBoard(boardLength), boardLength, position, positionDelimiter, player1Choice, player2Choice, movesCount, isPlaying, playerWon, };
}

function setup() {
  const world = init();

  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(world.screen.width, world.screen.height, world.screen.title);
  r.SetTargetFPS(60);

  const target = texture.createTexture(world.pixel, world.boardLength);
  world.target = target;
  world.texture = target.texture;

  return world;
}

function update(world) {
  const keyPressed = r.GetKeyPressed();

  texture.updateTexture(world.target, world.board, world.boardLength, world.pixel);

  game.updatePosition(keyPressed, world);

  world.isPlaying = game.updatePlayingStatus(world.movesCount, world.boardLength, world.isPlaying);

  if (keyPressed === r.KEY_ENTER) {
    game.makeMove(world);
    world.playerWon = game.isGameOver(world);
    world.isPlaying = !world.playerWon;
  }

  if (keyPressed === r.KEY_R) {
    game.resetGameState(world);
  }
}

function drawMessages(world) {
  const textX = 0;
  const textY = world.texture.height + 30;
  const textSize = 20;
  const textColor = r.WHITE;
  const currentPlayer = world.movesCount % 2;

  const prompt = `Enter player ${currentPlayer + 1} position: ${world.position}`;
  const playerWon = `Player ${Math.abs(currentPlayer - 1) + 1} Won`;
  const gameover = `Enter 'R' to replay`;
  const gameTie = `Match tie`;

  if (world.isPlaying && !world.playerWon) {
    r.DrawText(prompt, textX, textY, textSize, textColor);
  }

  if (world.playerWon) {
    r.DrawText(playerWon, textX, textY, textSize, textColor);
  }

  if (!world.playerWon && (world.movesCount === (world.boardLength * world.boardLength))) {
    r.DrawText(gameTie, textX, textY, textSize, textColor);
  }

  r.DrawText(gameover, textX, textY + textSize, textSize, textColor);
}

function draw(world) {
  r.BeginDrawing();
  r.ClearBackground(r.BLACK);

  board.drawBoard(world.texture);
  drawMessages(world);

  r.EndDrawing();
}

module.exports = {
  running,
  setup,
  update,
  draw,
  teardown,
}

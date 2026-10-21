const r = require("raylib");
const texture = require("./texture");
const game = require("./game");
const board = require("./board");

function running() { return !r.WindowShouldClose(); }

function teardown(world) {
  texture.teardown(world.target);
  r.CloseWindow();
}

function createScreen(width, height, title) { return { width, height, title }; }

function createPixel(width, height, lineThickness, textSize, color) { return { width, height, lineThickness, textSize, color }; }

function init() {
  const screen = createScreen(400, 400, "Tic Tac Toe");
  const pixel = createPixel(50, 50, 2.5, 30, r.WHITE);

  const boardLength = 3;

  const position = { input: "", delimiter: "-" };

  const playerChoices = { 1: "X", 2: "O" };

  const gameState = {
    movesCount: 0,
    isPlaying: true,
    playerWon: false,
  };

  return { screen, pixel, board: board.createBoard(boardLength), position, playerChoices, gameState, };
}

function setup() {
  const world = init();

  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(world.screen.width, world.screen.height, world.screen.title);
  r.SetTargetFPS(60);

  const target = texture.createTexture(world.pixel, world.board.boardLength);
  world.target = target;
  world.texture = target.texture;

  return world;
}

function update(world) {
  const keyPressed = r.GetKeyPressed();

  texture.updateTexture(world.target, world.board.gameBoard, world.board.boardLength, world.pixel);

  game.updateUserInput(keyPressed, world);

  world.gameState.isPlaying =
    game.getPlayingStatus(world.gameState.movesCount, world.boardLength, world.gameState.isPlaying);

  if (keyPressed === r.KEY_ENTER) {
    game.makeMove(world);
    world.gameState.playerWon = game.isGameOver(world);
    world.gameState.isPlaying = !world.gameState.playerWon;
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
  const currentPlayer = world.gameState.movesCount % 2;

  const prompt = `Enter player ${currentPlayer + 1} position (row-col): ${world.position.input}`;
  const playerWon = `Player ${Math.abs(currentPlayer - 1) + 1} Won`;
  const restartGame = `Enter 'R' to restart`;
  const gameTie = `Match tie`;

  if (world.gameState.isPlaying && !world.gameState.playerWon) {
    r.DrawText(prompt, textX, textY, textSize, textColor);
  }

  if (world.gameState.playerWon) {
    r.DrawText(playerWon, textX, textY, textSize, textColor);
  }

  if (!world.gameState.playerWon && (world.gameState.movesCount === (world.boardLength * world.boardLength))) {
    r.DrawText(gameTie, textX, textY, textSize, textColor);
  }

  r.DrawText(restartGame, textX, textY + textSize, textSize, textColor);
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

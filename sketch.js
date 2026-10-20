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

function clearBoard(board, boardLength) {
  for (let row = 0; row < boardLength; row++) {
    for (let col = 0; col < boardLength; col++) {
      board[row][col] = "";
    }
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

function toAscii(char) { return char.charCodeAt(0); }

function getPlayerChar(movesCount, player1Choice, player2Choice) { return movesCount % 2 === 0 ? player1Choice : player2Choice; }

function init() {
  const screen = createScreen(400, 400, "Tic Tac Toe");
  const pixel = createPixel(50, 50, 2.5, 30, r.WHITE);
  const boardLength = 3;
  const board = createBoard(boardLength);
  const position = "";
  const positionDelimiter = "-";
  const player1Choice = "X";
  const player2Choice = "O";
  const movesCount = 0;
  const isPlaying = true;
  const playerWon = false;

  return { screen, pixel, board, boardLength, position, positionDelimiter, player1Choice, player2Choice, movesCount, isPlaying, playerWon, };
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

function drawLineNumbersToTexture(boardLength, pixel, offset) {
  for (let j = 1; j <= boardLength; j++) {
    const x = j * pixel.width + offset;
    r.DrawText(String(j), x, pixel.lineThickness, pixel.textSize, pixel.color);
  }

  for (let i = 1; i <= boardLength; i++) {
    const y = i * pixel.height + offset;
    r.DrawText(String(i), pixel.lineThickness, y, pixel.textSize, pixel.color);
  }
}

function drawBoardToTexture(boardLength, pixel, board, offset) {
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

  drawLineNumbersToTexture(boardLength, pixel, offset);
  drawBoardToTexture(boardLength, pixel, board, offset);

  r.EndTextureMode();

  return target;
}

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

function update(world) {
  updateTexture(world.target, world.board, world.boardLength, world.pixel);

  const keyPressed = r.GetKeyPressed();

  updatePosition(keyPressed, world);

  world.isPlaying = updatePlayingStatus(world.movesCount, world.boardLength, world.isPlaying);

  if (keyPressed === r.KEY_ENTER) {
    makeMove(world);
    world.playerWon = isGameOver(world);
    world.isPlaying = !world.playerWon;
  }

  if (keyPressed === r.KEY_R) {
    resetGameState(world);
  }
}

function drawBoardToWindow(texture) {
  const textureSource = { x: 0, y: 0, width: texture.width, height: -texture.height };
  const texturePosition = { x: 0, y: 0 };

  r.DrawTextureRec(texture, textureSource, texturePosition, r.WHITE);
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

  drawBoardToWindow(world.texture);
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

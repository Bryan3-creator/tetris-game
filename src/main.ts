import "./style.css";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_SIZE,
  BOARD_BACKGROUND,
  BLOCK_COLOR,
  arrowClassName,
  shapes,
  SCORE_PER_DELETED_ROW,
} from "./consts";
import { $, createBoard } from "./utils";

const arrowBtnsContainer = $({
  name: ".arrow_btns_container",
});

const arrowBtns = document.querySelectorAll(".arrow_btn");
const startBtn = $({
  name: ".start_game_btn",
});

const startBtnContainer = $({
  name: ".start_btn_container",
});
const gameOverAlert = $({
  name: ".game_over_alert",
});

const closeBtn = $({
  name: ".close_btn",
});
const scoreElement = $({
  name: ".score",
});

let isPlaying = false;
let score = 0;

const canvasContainer = $({
  name: ".container",
});
const canvas = $<HTMLCanvasElement>({ name: "canvas" });
const context = canvas.getContext("2d");

if (context === null) throw new Error("Error canvas");

canvas.width = BOARD_WIDTH * BLOCK_SIZE;
canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// here we create board to set pieces
let board = createBoard({
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
});

// We create piece with condernates and ahape

const piece = {
  position: {
    x: 10,
    y: 0,
  },
  shape: shapes[Math.floor(Math.random() * shapes.length)],
};

// update => it's going to update 60 items per second and it'll allow us to;update board and the canvas

let dropCounter = 0;
let lastTime = 0;

const update = (time = 0): void => {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;

  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      deleteRow();
    }
  }
  draw();
  if (isPlaying) {
    window.requestAnimationFrame(update);
  }
};

// draw => it'll allow us to draw on the canvas

const draw = (): void => {
  context.fillStyle = BOARD_BACKGROUND;
  context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = BLOCK_COLOR;
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "blue";
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1);
      }
    });
  });
};

// Here we iterate arrow buttons to move pieces

arrowBtns.forEach((btn) => {
  const className = btn.className.split(" ").pop();

  const { TOP, LEFT, DOWN, RIGHT } = arrowClassName;

  btn.addEventListener("click", () => {
    if (className === TOP) {
      const prevShape = piece.shape;
      rotatePiece();
      if (checkCollision()) {
        piece.shape = prevShape;
      }
    }

    if (className === LEFT) {
      piece.position.x--;
      if (checkCollision()) {
        piece.position.x++;
      }
    }
    if (className === DOWN) {
      piece.position.y++;
      if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        deleteRow();
      }
    }
    if (className === RIGHT) {
      piece.position.x++;
      if (checkCollision()) {
        piece.position.x--;
      }
    }
  });
});

// We have to check collisions to avoid piece bug

const checkCollision = (): boolean => {
  const hasColission = piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[piece.position.y + y]?.[piece.position.x + x] !== 0
      );
    });
  });
  return hasColission !== undefined;
};

// Solidify pieces and fix them on the board

const solidifyPiece = (): void => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[piece.position.y + y][piece.position.x + x] = 1;
      }
    });
  });
  gameOver();
};

// Delete row

const deleteRow = (): void => {
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      board.splice(y, 1);
      board.unshift(Array(1).fill(0));
      updateScore(score + SCORE_PER_DELETED_ROW);
    }
  });
};

// rotate piece

const rotatePiece = (): void => {
  const rotate: number[][] = [];
  for (let i = 0; i < piece.shape[0].length; i++) {
    const row = [];
    for (let j = piece.shape.length - 1; j >= 0; j--) {
      row.push(piece.shape[j][i]);
    }
    rotate.push(row);
  }
  piece.shape = rotate;
};

// game over

const gameOver = (): void => {
  setNewPiece();
  if (checkCollision()) {
    piece.position.y--;
    setNewPiece();
    isPlaying = false;
    updateScore(0);
    gameOverAlert.classList.remove("invisible");
  }
};

// generate index of the board

const setNewPiece = (): void => {
  let minIndex = 1;
  let maxIndex = BOARD_WIDTH - 2;
  let generatedIndex = Math.floor(Math.random() * BOARD_WIDTH - 2);
  piece.position.x =
    generatedIndex < minIndex
      ? 1
      : generatedIndex > maxIndex
      ? maxIndex
      : generatedIndex;
  piece.position.y = 0;
  piece.shape = shapes[Math.floor(Math.random() * shapes.length)];
};

// We show and hide the canvas and arrows

const toggleCanvasAndArrowsState = (hide: boolean): void => {
  if (hide) {
    startBtnContainer.classList.replace("invisble", "visible");
    canvasContainer.classList.add("invisible");
    arrowBtnsContainer.classList.add("invisible");
    return;
  }
  startBtnContainer.classList.replace("visible", "invisible");
  canvasContainer.classList.remove("invisible");
  arrowBtnsContainer.classList.remove("invisible");
};

closeBtn.addEventListener("click", () => {
  gameOverAlert.classList.add("invisible");
  resetBoard();
  isPlaying = true;
  update();
});

const resetBoard = (): void => {
  board = createBoard({
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
  });
};

// update score

const updateScore = (newScore: number): void => {
  score = newScore;
  scoreElement.textContent = `${score}`;
};

// start game

startBtn.addEventListener("click", () => {
  isPlaying = true;
  toggleCanvasAndArrowsState(false);
  update();
});

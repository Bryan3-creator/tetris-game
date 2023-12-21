import "./style.css";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_SIZE,
  BOARD_BACKGROUND,
  BLOCK_COLOR,
  arrowClassName,
} from "./consts";
import { $, createBoard } from "./utils";

const canvas = $<HTMLCanvasElement>({ name: "canvas" });
const context = canvas.getContext("2d");
const arrowBtns = document.querySelectorAll(".arrow_btn");

if (context === null) throw new Error("Error canvas");

canvas.width = BOARD_WIDTH * BLOCK_SIZE;
canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// here we create board to set pieces
const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
];

// We create piece with condernates and ahape

const piece = {
  position: {
    x: 10,
    y: 2,
  },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// update => it's going to update 60 items per second and it'll allow us to;update board and the canvas

const update = (): void => {
  draw();
  window.requestAnimationFrame(update);
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
      board[piece.position.y + y][piece.position.x + x] = value;
    });
  });
  piece.position.x = 10;
  piece.position.y = 0;
};

// Delete row

const deleteRow = (): void => {
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      board.splice(y, 1);
      board.unshift(Array(1).fill(0));
    }
  });
};

// lets execute update to start frames
update();

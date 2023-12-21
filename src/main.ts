import "./style.css";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_SIZE,
  BOARD_BACKGROUND,
} from "./consts";
import { $ } from "./utils";

const canvas = $<HTMLCanvasElement>({ name: "canvas" });
const context = canvas.getContext("2d");

if (context === null) throw new Error("Error canvas");

canvas.width = BOARD_WIDTH * BLOCK_SIZE;
canvas.height = BOARD_HEIGHT * BLOCK_SIZE;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

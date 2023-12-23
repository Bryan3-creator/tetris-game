import { CreateBoard } from "./params";

export const createBoard = (params: CreateBoard): number[][] => {
  const { width, height } = params;
  return Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));
};

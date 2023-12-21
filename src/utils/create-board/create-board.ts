import { CreateBoard } from "./params";

export const createBoard = (params: CreateBoard): number[][] => {
  const { width, height } = params;
  return Array(height).fill(Array(width).fill(0));
};

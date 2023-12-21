import { type GetElement } from "./params";

export const $ = <T extends HTMLElement>({ name }: GetElement): T => {
  const element = document.querySelector<T>(name);
  if (element === null) throw new Error("Not found element");
  return element;
};

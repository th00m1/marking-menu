import { Menu } from "./menu";

export type Position = { x: number; y: number };

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const menu = new Menu(
  document.getElementsByClassName("menu")[0] as HTMLElement
);

let isDrawing = false;
let cursorPosition: Position = { x: 0, y: 0 };
let holdTimer: ReturnType<typeof setTimeout> | null = null;

document.addEventListener("mousedown", (event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  isDrawing = true;
  cursorPosition = getCursorPosition(event);

  holdTimer = setTimeout(() => {
    menu.setPosition(cursorPosition);
    menu.displayMenu();
  }, 250);
});

document.addEventListener("mouseup", async () => {
  resetHoldTimer();

  isDrawing = false;
  await sleep(1);
  menu.closeMenu();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  resetHoldTimer();

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "black";
  ctx.moveTo(cursorPosition.x, cursorPosition.y);
  cursorPosition = getCursorPosition(event);
  ctx.lineTo(cursorPosition.x, cursorPosition.y);
  ctx.stroke();
});

window.addEventListener("resize", () => {
  resizeCanvas();
});

const resizeCanvas = () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
};

const getCursorPosition = (event: MouseEvent): Position => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  return { x, y };
};

const sleep = (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

const resetHoldTimer = () => {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
};

resizeCanvas();

import { Menu } from "./menu";
import { Toaster } from "./toaster";

export type Position = { x: number; y: number };

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const menu = new Menu(
  document.querySelector(".menu") as HTMLElement,
  document.querySelector(".sub-menu") as HTMLElement
);
const toaster = new Toaster(document.getElementById("toasters") as HTMLElement);

let isDrawing = false;
let cursorPosition: Position = { x: 0, y: 0 };
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let points: Position[] = [];

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

  if (menu.isOpen()) {
    menu.closeAll();
  } else {
    const res = determineShape(
      points[0],
      points[Math.round(points.length / 2)],
      points[points.length - 1]
    );
    toaster.success(res);
  }

  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  resetHoldTimer();

  if (menu.isOpen()) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (menu.isSubMenuOpen()) {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";
      ctx.moveTo(menu.getPosition().x, menu.getPosition().y);
      ctx.lineTo(menu.getSubMenuPosition().x, menu.getSubMenuPosition().y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    const { x, y } = menu.isSubMenuOpen()
      ? menu.getSubMenuPosition()
      : menu.getPosition();
    ctx.moveTo(x, y);
    cursorPosition = getCursorPosition(event);
    ctx.lineTo(cursorPosition.x, cursorPosition.y);
    menu.setItemHoverClass(cursorPosition);

    const selectedItem = menu.getItemActive(cursorPosition);

    if (selectedItem && menu.isSubMenuOpen()) {
      const selected = menu.setSelectedItem(selectedItem.direction);
      toaster.success(selected);
      menu.closeAll();
    } else if (selectedItem) {
      menu.closeMenu();
      menu.openSubMenu(selectedItem.itemCenter);
    }

    ctx.stroke();
  }

  if (!menu.isOpen()) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(cursorPosition.x, cursorPosition.y);
    points.push({ x: cursorPosition.x, y: cursorPosition.y });
    cursorPosition = getCursorPosition(event);
    ctx.lineTo(cursorPosition.x, cursorPosition.y);
    ctx.stroke();
  }
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

const determineShape = (start: Position, mid: Position, end: Position) => {
  if (isHorizontalLine(start, mid, end)) {
    if (start.x < end.x) {
      return "Sub Item 2";
    } else {
      return "Sub Item 4";
    }
  } else if (isVerticalLine(start, mid, end)) {
    if (start.y > end.y) {
      return "Sub Item 1";
    } else {
      return "Sub Item 3";
    }
  } else if (start.x < end.x && start.y < end.y) {
    return "Sub Item 2";
  } else if (start.x < end.x && start.y > end.y) {
    return "Sub Item 2";
  } else if (start.x > end.x && start.y > end.y) {
    return "Sub Item 4";
  } else if (start.x > end.x && start.y < end.y) {
    return "Sub Item 4";
  }

  return "";
};

const isHorizontalLine = (start: Position, mid: Position, end: Position) => {
  const tolerance = 50;
  return (
    Math.abs(start.y - mid.y) <= tolerance &&
    Math.abs(start.y - end.y) <= tolerance
  );
};

const isVerticalLine = (start: Position, mid: Position, end: Position) => {
  const tolerance = 50;
  return (
    Math.abs(start.x - mid.x) <= tolerance &&
    Math.abs(start.x - end.x) <= tolerance
  );
};

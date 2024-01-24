import { Position } from "./main";

export class Menu {
  constructor(private menu: HTMLElement) {}

  displayMenu() {
    this.menu.classList.add("menu--open");
  }

  closeMenu() {
    this.menu.classList.remove("menu--open");
  }

  setPosition(position: Position) {
    this.menu.style.top = `${position.y}px`;
    this.menu.style.left = `${position.x}px`;
  }

  isOpen(): boolean {
    return this.menu.classList.contains("menu--open");
  }
}

import { Position } from "./main";

export class Menu {
  private menu: HTMLElement;
  private items: Element[];
  private subItems: Element[];
  private subMenu: HTMLElement;
  private position: Position = { x: 0, y: 0 };
  private subMenuPosition: Position = { x: 0, y: 0 };
  private selectedItem: string | undefined;

  constructor(menu: HTMLElement, subMenu: HTMLElement) {
    this.menu = menu;
    this.items = [...this.menu.querySelectorAll(".item")];
    this.subMenu = subMenu;
    this.subItems = [...this.subMenu.querySelectorAll(".sub-menu__item")];
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  setSelectedItem(direction: number) {
    const item = this.subItems[direction];
    const text = item.innerHTML;
    this.selectedItem = text;
    return text;
  }

  displayMenu() {
    this.menu.classList.add("menu--open");
  }

  closeMenu() {
    this.menu.classList.remove("menu--open");
  }

  setPosition(position: Position) {
    this.position = position;
    this.menu.style.top = `${position.y}px`;
    this.menu.style.left = `${position.x}px`;
  }

  setSubMenuPosition(itemPosition: Position) {
    this.subMenuPosition = itemPosition;
    this.subMenu.style.top = `${itemPosition.y}px`;
    this.subMenu.style.left = `${itemPosition.x}px`;
  }

  getPosition(): Position {
    return this.position;
  }

  getSubMenuPosition(): Position {
    return this.subMenuPosition;
  }

  isOpen(): boolean {
    return (
      this.menu.classList.contains("menu--open") ||
      this.subMenu.classList.contains("sub-menu--open")
    );
  }

  isSubMenuOpen(): boolean {
    return this.subMenu.classList.contains("sub-menu--open");
  }

  setItemHoverClass(cursor: Position, items: Element[] = this.items): void {
    const itemIndex = this.getItemHover(cursor);
    for (let i = 0; i < items.length; i++) {
      if (i === itemIndex) {
        this.items[i].classList.add("item--active");
      } else {
        this.items[i].classList.remove("item--active");
      }
    }
  }

  getItemActive(
    cursor: Position
  ): { direction: number; itemCenter: Position } | null {
    const direction = this.getItemHover(cursor);
    const threshold = 20;
    const itemCenter = this.getItemCenter(direction);
    const distanceToItem = Math.hypot(
      Math.abs(cursor.x - itemCenter.x),
      Math.abs(cursor.y - itemCenter.y)
    );

    if (distanceToItem < threshold) {
      return { direction, itemCenter };
    } else {
      return null;
    }
  }

  openSubMenu(position: Position): void {
    this.setSubMenuPosition(position);
    this.subMenu.classList.add("sub-menu--open");
  }

  closeSubMenu(): void {
    this.subMenu.classList.remove("sub-menu--open");
  }

  closeAll() {
    this.closeMenu();
    this.closeSubMenu();
  }

  private getItemHover(cursor: Position): number {
    const angle = Math.atan2(
      cursor.y - this.position.y,
      cursor.x - this.position.x
    );
    const angleInDegrees = (angle * 180) / Math.PI;

    if (angleInDegrees < 45 && angleInDegrees > -45) {
      return 1;
    } else if (angleInDegrees >= 45 && angleInDegrees <= 135) {
      return 2;
    } else if (angleInDegrees > 135 || angleInDegrees < -135) {
      return 3;
    } else {
      return 0;
    }
  }

  private getItemCenter(direction: number): Position {
    const items = this.isSubMenuOpen() ? this.subItems : this.items;
    const item = this.isSubMenuOpen() ? items[direction] : items[direction];

    const rect = item.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
}

export class Toaster {
  constructor(private container: HTMLElement) {}

  success(value: string) {
    this.createToaster(value, true);
  }

  error() {
    const message = "Symbol is not valid, unable to select an item";
    this.createToaster(message, false);
  }

  private createToaster(content: string, isSuccess: boolean) {
    const toasterElement = this.fromHTML(
      `
      <div class="toaster ${isSuccess ? "success" : "error"}">
        <div class="icon"></div>
        <div class="content">${content}</div>
      </div>
      `
    );

    this.container.appendChild(toasterElement);
    this.setupTimeout(toasterElement);
  }

  private fromHTML(html: string) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
  }

  private setupTimeout(toasterElement: HTMLElement) {
    const timeoutDuration = 1500;
    setTimeout(() => {
      this.container.removeChild(toasterElement);
    }, timeoutDuration);
  }
}

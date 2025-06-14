export class Header {
  constructor() {
    this.element = null;
  }

  render() {
    const template = `
      <header>
        <div class="logo">
          <a href=""><img alt="logo" src="../assets/images/logo.png" /></a>
        </div>
      </header>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }
}

export class Footer {
  constructor() {
    this.element = null;
  }

  render() {
    const template = `
      <footer>
        <p>Copyright 2025 EekErk</p>
      </footer>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }
}

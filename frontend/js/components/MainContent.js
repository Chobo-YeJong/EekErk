import { ExchangeHeader } from './ExchangeHeader.js';
import { ExchangeTable } from './ExchangeTable.js';

export class MainContent {
  constructor() {
    this.element = null;
    this.exchangeHeader = new ExchangeHeader();
    this.exchangeTable = new ExchangeTable();
  }

  render() {
    const template = `
      <div class="content-area">
        <div id="exchange-header-container"></div>
        <div id="exchange-table-container"></div>
      </div>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;

    const contentArea = this.element.firstElementChild;

    // 하위 컴포넌트 렌더링
    const headerContainer = contentArea.querySelector(
      '#exchange-header-container'
    );
    const tableContainer = contentArea.querySelector(
      '#exchange-table-container'
    );

    headerContainer.appendChild(this.exchangeHeader.render());
    tableContainer.appendChild(this.exchangeTable.render());

    return contentArea;
  }

  bindEvents() {
    this.exchangeHeader.bindEvents();

    // 이벤트 콜백 설정
    this.exchangeHeader.onExchangeCalculate =
      this.handleExchangeCalculate.bind(this);
    this.exchangeHeader.onTypeChange = this.handleTypeChange.bind(this);
  }

  handleExchangeCalculate(data) {
    console.log('Calculating exchange for:', data);
    // 여기서 API 호출하여 환전 데이터 업데이트
  }

  handleTypeChange(type) {
    console.log('Exchange type changed to:', type);
    // 환전 타입에 따른 데이터 업데이트
  }

  updateCountry(countryData) {
    this.exchangeHeader.updateCountry(countryData);
  }
}

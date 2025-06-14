import { fetchRates } from '../core/FetchRates.js';

export class ExchangeTable {
  constructor() {
    this.element = null;
    // 기존 하드코딩된 데이터를 fetchRates에서 가져오도록 변경
    this.exchangeData = fetchRates.getExchangeData('cn'); // 기본값은 중국
  }

  render() {
    const tableRows = this.exchangeData
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item.savings}</td>
        <td>${item.tip}</td>
      </tr>
    `
      )
      .join('');

    const template = `
      <div class="exchange-table">
        <table>
          <thead>
            <tr>
              <th>환전소</th>
              <th>필요 원화</th>
              <th>절약 금액</th>
              <th>환전 꿀팁</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }

  updateData(newData) {
    this.exchangeData = newData;
    const tbody = this.element.querySelector('tbody');
    const tableRows = this.exchangeData
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item.savings}</td>
        <td>${item.tip}</td>
      </tr>
    `
      )
      .join('');
    tbody.innerHTML = tableRows;
  }
}

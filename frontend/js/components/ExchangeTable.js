import { fetchRates } from '../core/FetchRates.js';

export class ExchangeTable {
  constructor() {
    this.element = null;
    this.exchangeData = fetchRates.getExchangeData('cn'); // 기본값은 중국
  }

  // 테이블 행 생성 로직을 별도 메서드로 분리
  generateTableRows(data = this.exchangeData) {
    return data
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
  }

  render() {
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
            ${this.generateTableRows()}
          </tbody>
        </table>
      </div>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }

  // 더 간결하고 효율적인 업데이트
  updateData(newData) {
    this.exchangeData = newData;

    // tbody만 선택적으로 업데이트
    const tbody = this.element?.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = this.generateTableRows(newData);
    }
  }
}

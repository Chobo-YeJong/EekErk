export class ExchangeHeader {
  constructor() {
    this.element = null;
    this.currentCountry = {
      code: 'cn',
      name: '중국',
      currency: 'CNY',
      currencyName: '위안',
    };
  }

  render() {
    const template = `
      <div class="exchange-header">
        <div class="currency-info">
          <span class="fi fi-${this.currentCountry.code}"></span>
          <p>${this.currentCountry.name}</p>
          <p>|</p>
          <p>${this.currentCountry.currency}</p>
          <p>|</p>
          <p>${this.currentCountry.currencyName}</p>
        </div>
        <div class="exchange-controls">
          <div class="exchange-type">
            <label>
              <select id="exchange-type">
                <option value="buy">살때</option>
                <option value="sell">팔때</option>
              </select>
            </label>
          </div>
          <div class="amount-input">
            <label>
              <input type="text" id="amount-input" placeholder="금액 입력" />
            </label>
            <button id="confirm-btn">확인</button>
          </div>
        </div>
      </div>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }

  bindEvents() {
    if (this.element) {
      const confirmBtn = this.element.querySelector('#confirm-btn');
      const amountInput = this.element.querySelector('#amount-input');
      const exchangeType = this.element.querySelector('#exchange-type');

      confirmBtn.addEventListener('click', this.handleConfirm.bind(this));
      exchangeType.addEventListener('change', this.handleTypeChange.bind(this));
    }
  }

  handleConfirm() {
    const amount = this.element.querySelector('#amount-input').value;
    const type = this.element.querySelector('#exchange-type').value;

    if (amount) {
      this.onExchangeCalculate({ amount, type, country: this.currentCountry });
    }
  }

  handleTypeChange(event) {
    this.onTypeChange(event.target.value);
  }

  updateCountry(countryData) {
    this.currentCountry = countryData;
    const currencyInfo = this.element.querySelector('.currency-info');
    currencyInfo.innerHTML = `
      <span class="fi fi-${countryData.code}"></span>
      <p>${countryData.name}</p>
      <p>|</p>
      <p>${countryData.currency}</p>
      <p>|</p>
      <p>${countryData.currencyName}</p>
    `;
  }

  onExchangeCalculate(data) {
    // 콜백 - App.js에서 설정
    console.log('Exchange calculate:', data);
  }

  onTypeChange(type) {
    // 콜백 - App.js에서 설정
    console.log('Exchange type changed:', type);
  }
}

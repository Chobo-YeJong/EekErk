export class ExchangeTable {
  constructor() {
    this.element = null;
    this.exchangeData = [
      {
        name: '우리은행 환전소',
        amount: '1,310,000원',
        savings: '25,000원',
        tip: '모바일 앱으로 사전 신청 시 우대율 90%',
      },
      {
        name: '하나은행 명동점',
        amount: '1,305,000원',
        savings: '30,000원',
        tip: '신한카드 결제 시 추가 우대',
      },
      {
        name: '신한은행 인천공항',
        amount: '1,320,000원',
        savings: '15,000원',
        tip: '공항 내 자동환전기 이용 가능',
      },
      {
        name: '한국투어익스프레스',
        amount: '1,290,000원',
        savings: '45,000원',
        tip: '미리 온라인 예약하면 수수료 면제',
      },
      {
        name: 'KEB하나 외환센터',
        amount: '1,315,000원',
        savings: '20,000원',
        tip: '여권 지참 시 VIP 우대율 적용',
      },
    ];
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

import { Header } from './components/Header.js';
import { SidebarCountry } from './components/SidebarCountry.js';
import { MainContent } from './components/MainContent.js';
import { Footer } from './components/Footer.js';

export class App {
  constructor(container) {
    this.container = container;
    this.appElement = null;
    this.header = new Header();
    this.sidebar = new SidebarCountry();
    this.mainContent = new MainContent();
    this.footer = new Footer();

    // 국가 데이터 매핑
    this.countryData = {
      cn: {
        code: 'cn',
        name: '중국',
        currency: 'CNY',
        currencyName: '위안',
      },
      jp: {
        code: 'jp',
        name: '일본',
        currency: 'JPY',
        currencyName: '엔',
      },
      us: {
        code: 'us',
        name: '미국',
        currency: 'USD',
        currencyName: '달러',
      },
    };

    // 현재 선택된 국가
    this.currentCountry = this.countryData['cn'];
  }

  init() {
    this.render();
    this.bindEvents();
    this.loadInitialData();
    console.log('EekErk SPA가 초기화되었습니다.');
  }

  render() {
    // 앱 구조 템플릿
    const appTemplate = `
      <div id="app-content">
        <div id="header-container"></div>
        <main id="main-layout">
          <div id="sidebar-container"></div>
          <div id="main-content-container"></div>
        </main>
        <div id="footer-container"></div>
      </div>
    `;

    // 컨테이너에 앱 구조 삽입
    this.container.innerHTML = appTemplate;
    this.appElement = this.container.querySelector('#app-content');

    // 각 컴포넌트 렌더링
    this.renderComponents();
  }

  renderComponents() {
    // 헤더 렌더링
    const headerContainer = this.container.querySelector('#header-container');
    headerContainer.appendChild(this.header.render());

    // 사이드바 렌더링
    const sidebarContainer = this.container.querySelector('#sidebar-container');
    sidebarContainer.appendChild(this.sidebar.render());

    // 메인 콘텐츠 렌더링
    const mainContentContainer = this.container.querySelector(
      '#main-content-container'
    );
    mainContentContainer.appendChild(this.mainContent.render());

    // 푸터 렌더링
    const footerContainer = this.container.querySelector('#footer-container');
    footerContainer.appendChild(this.footer.render());
  }

  bindEvents() {
    // 사이드바 이벤트 바인딩
    this.sidebar.bindEvents();
    this.sidebar.onCountrySelect = this.handleCountrySelect.bind(this);

    // 메인 콘텐츠 이벤트 바인딩
    this.mainContent.bindEvents();

    // 환전 관련 이벤트 바인딩
    this.mainContent.exchangeHeader.onExchangeCalculate =
      this.handleExchangeCalculate.bind(this);
    this.mainContent.exchangeHeader.onTypeChange =
      this.handleExchangeTypeChange.bind(this);
  }

  loadInitialData() {
    // 초기 데이터 로드
    this.updateExchangeData('cn');
    this.updateSidebarSelection('cn');
  }

  handleCountrySelect(countryCode) {
    console.log('국가 선택됨:', countryCode);

    const selectedCountry = this.countryData[countryCode];
    if (selectedCountry) {
      this.currentCountry = selectedCountry;

      // 메인 콘텐츠의 국가 정보 업데이트
      this.mainContent.updateCountry(selectedCountry);

      // 선택된 국가에 따른 환전 데이터 업데이트
      this.updateExchangeData(countryCode);

      // 사이드바에서 선택된 항목 스타일 업데이트
      this.updateSidebarSelection(countryCode);
    }
  }

  handleExchangeCalculate(data) {
    console.log('환전 계산 요청:', data);

    const { amount, type, country } = data;

    // 입력값 검증
    if (!amount || isNaN(parseFloat(amount))) {
      this.showMessage('올바른 금액을 입력해주세요.', 'error');
      return;
    }

    // 환전 계산 실행
    this.calculateExchange(parseFloat(amount), type, country);
    this.showMessage('환전 정보가 업데이트되었습니다.', 'success');
  }

  handleExchangeTypeChange(type) {
    console.log('환전 타입 변경:', type);

    // 환전 타입에 따른 테이블 데이터 업데이트
    this.updateExchangeTableByType(type);
  }

  updateExchangeData(countryCode) {
    // 국가별 환전소 데이터 (실제로는 API에서 가져올 데이터)
    const mockExchangeData = {
      cn: [
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
      ],
      jp: [
        {
          name: '우리은행 환전소',
          amount: '95,000원',
          savings: '3,000원',
          tip: '일본 엔화 특별 우대율 적용',
        },
        {
          name: '하나은행 명동점',
          amount: '93,500원',
          savings: '4,500원',
          tip: '여행자보험 가입 시 추가 할인',
        },
        {
          name: '신한은행 인천공항',
          amount: '96,200원',
          savings: '1,800원',
          tip: '공항 내 자동환전기 24시간 이용',
        },
      ],
      us: [
        {
          name: '우리은행 환전소',
          amount: '1,350,000원',
          savings: '15,000원',
          tip: '달러 대량 환전 시 우대율 적용',
        },
        {
          name: 'KEB하나 외환센터',
          amount: '1,340,000원',
          savings: '25,000원',
          tip: '온라인 예약 시 수수료 할인',
        },
        {
          name: '신한은행 인천공항',
          amount: '1,360,000원',
          savings: '5,000원',
          tip: '공항 픽업 서비스 제공',
        },
      ],
    };

    const countryExchangeData =
      mockExchangeData[countryCode] || mockExchangeData['cn'];
    this.mainContent.exchangeTable.updateData(countryExchangeData);
  }

  updateSidebarSelection(countryCode) {
    // 기존 선택 항목 제거
    const currentSelected = this.sidebar.element.querySelector(
      '.country-item.selected'
    );
    if (currentSelected) {
      currentSelected.classList.remove('selected');
    }

    // 새로운 선택 항목 추가
    const countryLinks = this.sidebar.element.querySelectorAll(
      `a[data-country="${countryCode}"]`
    );
    if (countryLinks.length > 0) {
      countryLinks[0].closest('.country-item').classList.add('selected');
    }
  }

  calculateExchange(amount, type, country) {
    console.log(
      `${country.name} ${country.currency} ${amount} ${type === 'buy' ? '살때' : '팔때'} 계산 중...`
    );

    // 실제 환전 계산 로직
    const baseRate = this.getBaseExchangeRate(country.code);
    const fee = type === 'buy' ? 1.02 : 0.98; // 수수료 적용
    const calculatedAmount = Math.floor(amount * baseRate * fee);

    // 계산 결과를 기반으로 테이블 업데이트
    this.updateCalculatedExchangeData(amount, calculatedAmount, country.code);
  }

  getBaseExchangeRate(countryCode) {
    const rates = {
      cn: 190, // 1 CNY = 190 KRW
      jp: 9.5, // 1 JPY = 9.5 KRW
      us: 1350, // 1 USD = 1350 KRW
    };
    return rates[countryCode] || 1000;
  }

  updateCalculatedExchangeData(inputAmount, calculatedAmount, countryCode) {
    // 계산된 금액을 기반으로 환전소 데이터 재계산
    const variation = 0.03; // 3% 변동폭

    const currentData = this.mainContent.exchangeTable.exchangeData;
    const updatedData = currentData.map((item, index) => {
      const randomFactor = 1 + (Math.random() - 0.5) * variation;
      const newAmount = Math.floor(calculatedAmount * randomFactor);
      const savings = Math.abs(calculatedAmount - newAmount);

      return {
        ...item,
        amount: `${newAmount.toLocaleString()}원`,
        savings: `${savings.toLocaleString()}원`,
      };
    });

    this.mainContent.exchangeTable.updateData(updatedData);
  }

  updateExchangeTableByType(type) {
    console.log(`환전 타입 ${type}에 따른 테이블 업데이트`);

    // 환전 타입에 따른 수수료 조정
    const currentData = this.mainContent.exchangeTable.exchangeData;
    const adjustmentFactor = type === 'buy' ? 1.01 : 0.99;

    const adjustedData = currentData.map((item) => {
      const currentAmount = parseInt(item.amount.replace(/[^0-9]/g, ''));
      const newAmount = Math.floor(currentAmount * adjustmentFactor);
      const savings = Math.abs(currentAmount - newAmount);

      return {
        ...item,
        amount: `${newAmount.toLocaleString()}원`,
        savings: `${savings.toLocaleString()}원`,
      };
    });

    this.mainContent.exchangeTable.updateData(adjustedData);
  }

  showMessage(message, type = 'info') {
    // 간단한 메시지 표시 (실제로는 더 예쁜 토스트 메시지 구현)
    console.log(`[${type.toUpperCase()}] ${message}`);

    // 임시로 alert 사용 (나중에 커스텀 알림으로 교체)
    if (type === 'error') {
      alert(message);
    }
  }

  // 앱 종료 시 정리 작업
  destroy() {
    console.log('App이 종료됩니다.');

    // 컨테이너 정리
    if (this.container) {
      this.container.innerHTML = '';
    }

    // 참조 정리
    this.header = null;
    this.sidebar = null;
    this.mainContent = null;
    this.footer = null;
  }
}

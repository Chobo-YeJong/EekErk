import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { SidebarCountry } from './components/SidebarCountry.js';
import { MainContent } from './components/MainContent.js';
import { appState } from './core/state.js';
import { fetchRates } from './core/FetchRates.js';
import { router } from './core/Router.js';

export class App {
  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.sidebar = new SidebarCountry();
    this.mainContent = new MainContent();
  }

  // init 메서드 추가
  init() {
    this.initializeRouter();
    this.setupState();
    this.render();
  }

  initializeRouter() {
    router.addRoute('/', () => {
      this.handleCountrySelect('cn'); // 기본 중국
    });

    router.addRoute('/country', (countryCode) => {
      this.handleCountrySelect(countryCode);
    });
  }

  setupState() {
    // 초기 상태 설정
    appState.setState('selectedCountry', 'cn');
    appState.setState('exchangeType', 'buy');
    appState.setState('amount', '');

    // 상태 변경 구독
    appState.subscribe('selectedCountry', (countryCode) => {
      this.updateCountrySelection(countryCode);
    });
  }

  render() {
    const app = document.querySelector('.App');
    app.innerHTML = '';

    const template = `
      <div id="header-container"></div>
      <main id="main-layout">
        <div id="sidebar-container"></div>
        <div id="main-content-container"></div>
      </main>
      <div id="footer-container"></div>
    `;

    app.innerHTML = template;

    // 컴포넌트 렌더링
    const headerContainer = app.querySelector('#header-container');
    const sidebarContainer = app.querySelector('#sidebar-container');
    const mainContentContainer = app.querySelector('#main-content-container');
    const footerContainer = app.querySelector('#footer-container');

    headerContainer.appendChild(this.header.render());
    sidebarContainer.appendChild(this.sidebar.render());
    mainContentContainer.appendChild(this.mainContent.render());
    footerContainer.appendChild(this.footer.render());

    this.bindEvents();
  }

  bindEvents() {
    this.sidebar.bindEvents();
    this.mainContent.bindEvents();

    // 사이드바 국가 선택 이벤트
    this.sidebar.onCountrySelect = this.handleCountrySelect.bind(this);

    // 환전 계산 이벤트
    this.mainContent.exchangeHeader.onExchangeCalculate =
      this.handleExchangeCalculate.bind(this);
  }

  handleCountrySelect(countryCode) {
    // 상태 업데이트
    appState.setState('selectedCountry', countryCode);

    // URL 업데이트
    if (router.getCurrentRoute() !== router.getCountryRoute(countryCode)) {
      router.push(router.getCountryRoute(countryCode));
    }
  }

  updateCountrySelection(countryCode) {
    // fetchRates에서 국가 데이터 가져오기
    const countryData = fetchRates.getCountryData(countryCode);

    if (countryData) {
      // UI 업데이트
      this.updateSidebarSelection(countryCode);
      this.mainContent.updateCountry(countryData);
    }
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

  handleExchangeCalculate(data) {
    const { amount, type, country } = data;

    // fetchRates에서 계산
    const calculatedAmount = fetchRates.calculateExchange(
      parseInt(amount),
      type,
      country.code
    );

    // fetchRates에서 환전소 데이터 생성
    const exchangeData = fetchRates.generateCalculatedExchangeData(
      amount,
      calculatedAmount,
      country.code
    );

    // 테이블 업데이트
    this.mainContent.exchangeTable.updateData(exchangeData);
  }
}

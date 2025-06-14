export class FetchRates {
  // 상수들을 클래스 상단에 정리
  static EXCHANGE_VARIATION = 0.03;
  static DEFAULT_COUNTRY = 'cn';
  static DEFAULT_RATE = 1000;

  constructor() {
    this.countryData = this.initializeCountryData();
    this.mockExchangeData = this.initializeMockExchangeData();
    this.baseRates = this.initializeBaseRates();
  }

  // 데이터 초기화를 별도 메서드로 분리
  initializeCountryData() {
    return {
      cn: { code: 'cn', name: '중국', currency: 'CNY', currencyName: '위안' },
      jp: { code: 'jp', name: '일본', currency: 'JPY', currencyName: '엔' },
      us: { code: 'us', name: '미국', currency: 'USD', currencyName: '달러' },
    };
  }

  initializeBaseRates() {
    return {
      cn: 190, // 1 CNY = 190 KRW
      jp: 9.5, // 1 JPY = 9.5 KRW
      us: 1350, // 1 USD = 1350 KRW
    };
  }

  initializeMockExchangeData() {
    return {
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
  }

  getCountryData(countryCode) {
    return this.countryData[countryCode];
  }

  getAllCountries() {
    return this.countryData;
  }

  getExchangeData(countryCode) {
    return (
      this.mockExchangeData[countryCode] ||
      this.mockExchangeData[FetchRates.DEFAULT_COUNTRY]
    );
  }

  getBaseRate(countryCode) {
    return this.baseRates[countryCode] || FetchRates.DEFAULT_RATE;
  }

  // 수수료 계산 로직을 별도 메서드로 분리
  calculateFeeRate(type) {
    return type === 'buy' ? 1.02 : 0.98;
  }

  calculateExchange(amount, type, countryCode) {
    const baseRate = this.getBaseRate(countryCode);
    const feeRate = this.calculateFeeRate(type);
    return Math.floor(amount * baseRate * feeRate);
  }

  // 개별 환전소 데이터 생성 로직 분리
  generateSingleExchangeData(item, calculatedAmount) {
    const randomFactor =
      1 + (Math.random() - 0.5) * FetchRates.EXCHANGE_VARIATION;
    const newAmount = Math.floor(calculatedAmount * randomFactor);
    const savings = Math.abs(calculatedAmount - newAmount);

    return {
      ...item,
      amount: `${newAmount.toLocaleString()}원`,
      savings: `${savings.toLocaleString()}원`,
    };
  }

  generateCalculatedExchangeData(inputAmount, calculatedAmount, countryCode) {
    const baseData = this.getExchangeData(countryCode);

    return baseData.map((item) =>
      this.generateSingleExchangeData(item, calculatedAmount)
    );
  }
}

// 전역 서비스 인스턴스
export const fetchRates = new FetchRates();

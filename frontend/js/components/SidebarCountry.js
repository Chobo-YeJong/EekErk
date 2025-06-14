import { fetchRates } from '../core/FetchRates.js';

export class SidebarCountry {
  constructor() {
    this.element = null;
    // 기존 하드코딩된 countries 배열을 fetchRates에서 가져오도록 변경
    this.countries = this.getCountriesFromFetchRates();
  }

  getCountriesFromFetchRates() {
    const allCountries = fetchRates.getAllCountries();
    // 기존과 같은 형태로 변환 (중복 제거)
    return Object.values(allCountries);
  }

  render() {
    const countryItems = this.countries
      .map(
        (country) => `
      <li class="country-item">
        <a href="" data-country="${country.code}">
          <span class="fi fi-${country.code}"></span>
          ${country.name}
        </a>
      </li>
    `
      )
      .join('');

    const template = `
      <div class="sidebar-country">
        <aside>
          <ul class="country-list">
            ${countryItems}
          </ul>
        </aside>
      </div>
    `;

    this.element = document.createElement('div');
    this.element.innerHTML = template;
    return this.element.firstElementChild;
  }

  bindEvents() {
    if (this.element) {
      this.element.addEventListener(
        'click',
        this.handleCountryClick.bind(this)
      );
    }
  }

  handleCountryClick(event) {
    event.preventDefault();
    const countryLink = event.target.closest('a[data-country]');
    if (countryLink) {
      const countryCode = countryLink.dataset.country;
      // 국가 선택 이벤트 발생
      this.onCountrySelect(countryCode);
    }
  }

  onCountrySelect(countryCode) {
    // 이벤트 콜백 - 나중에 App.js에서 설정
    console.log('Country selected:', countryCode);
  }
}

import { fetchRates } from '../core/FetchRates.js';

export class SidebarCountry {
  constructor() {
    this.element = null;
    this.countries = this.getCountriesFromFetchRates();
  }

  getCountriesFromFetchRates() {
    return Object.values(fetchRates.getAllCountries());
  }

  // 국가 아이템 생성 로직을 별도 메서드로 분리
  generateCountryItem(country) {
    return `
      <li class="country-item">
        <a href="" data-country="${country.code}">
          <span class="fi fi-${country.code}"></span>
          ${country.name}
        </a>
      </li>
    `;
  }

  render() {
    const countryItems = this.countries
      .map((country) => this.generateCountryItem(country))
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
    this.element?.addEventListener('click', this.handleCountryClick.bind(this));
  }

  handleCountryClick(event) {
    event.preventDefault();

    const countryLink = event.target.closest('a[data-country]');
    if (!countryLink) return;

    const countryCode = countryLink.dataset.country;
    this.onCountrySelect?.(countryCode); // 옵셔널 체이닝 사용
  }

  // 기본 콜백을 빈 함수로 설정
  onCountrySelect = () => {};
}

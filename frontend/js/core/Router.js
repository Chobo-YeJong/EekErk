// 기본 해시 기반 라우터
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';

    // 브라우저 해시 변경 감지
    window.addEventListener('hashchange', this.handleHashChange.bind(this));

    // 초기 로드 시 현재 해시 처리
    this.handleHashChange();
  }

  // 라우트 등록
  addRoute(path, callback) {
    this.routes[path] = callback;
  }

  // 해시 변경 처리
  handleHashChange() {
    const hash = window.location.hash.slice(1) || '/'; // # 제거
    this.navigate(hash);
  }

  // 라우트 이동
  navigate(path) {
    this.currentRoute = path;

    // 등록된 라우트 콜백 실행
    if (this.routes[path]) {
      this.routes[path]();
    }

    // 국가 코드 추출 (예: /country/cn)
    const countryMatch = path.match(/^\/country\/([a-z]{2})$/);
    if (countryMatch && this.routes['/country']) {
      this.routes['/country'](countryMatch[1]);
    }
  }

  // 프로그래밍 방식으로 라우트 변경
  push(path) {
    window.location.hash = path;
  }

  // 현재 라우트 가져오기
  getCurrentRoute() {
    return this.currentRoute;
  }

  // 국가 코드에서 라우트 생성
  getCountryRoute(countryCode) {
    return `/country/${countryCode}`;
  }

  // 현재 선택된 국가 코드 추출
  getCurrentCountryCode() {
    const match = this.currentRoute.match(/^\/country\/([a-z]{2})$/);
    return match ? match[1] : 'cn'; // 기본값은 중국
  }
}

// 전역 라우터 인스턴스
export const router = new Router();

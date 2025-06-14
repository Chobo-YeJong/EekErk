import { App } from './App.js';

// DOM이 완전히 로드된 후 앱 실행
document.addEventListener('DOMContentLoaded', () => {
  // 앱 컨테이너 확인
  const appContainer = document.querySelector('.App');

  if (!appContainer) {
    console.error('앱 컨테이너(.App)를 찾을 수 없습니다.');
    return;
  }

  // 앱 인스턴스 생성 및 초기화
  const app = new App(appContainer);
  app.init();

  // 전역 앱 인스턴스 (디버깅용)
  window.app = app;

  console.log('EekErk 앱이 시작되었습니다!');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (window.app) {
    window.app.destroy();
  }
});

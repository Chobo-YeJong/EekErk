// 기본 pub-sub 상태 관리 시스템
export class State {
  constructor() {
    this.state = {};
    this.observers = {};
  }

  // 상태 설정
  setState(key, value) {
    this.state[key] = value;
    this.notify(key, value);
  }

  // 상태 가져오기
  getState(key) {
    return this.state[key];
  }

  // 상태 변경 구독
  subscribe(key, callback) {
    if (!this.observers[key]) {
      this.observers[key] = [];
    }
    this.observers[key].push(callback);
  }

  // 구독 해제
  unsubscribe(key, callback) {
    if (this.observers[key]) {
      this.observers[key] = this.observers[key].filter(
        (obs) => obs !== callback
      );
    }
  }

  // 구독자들에게 알림
  notify(key, value) {
    if (this.observers[key]) {
      this.observers[key].forEach((callback) => callback(value));
    }
  }
}

// 전역 상태 인스턴스
export const appState = new State();

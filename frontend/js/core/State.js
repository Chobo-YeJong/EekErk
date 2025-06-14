export class State {
  constructor() {
    this.state = {};
    this.observers = {};
  }

  setState(key, value) {
    if (typeof key !== 'string') {
      console.warn('State key must be a string');
      return;
    }

    const oldValue = this.state[key];
    this.state[key] = value;

    // 값이 실제로 변경된 경우에만 알림
    if (oldValue !== value) {
      this.notify(key, value);
    }
  }

  getState(key) {
    return this.state[key];
  }

  // 전체 상태 가져오기 (디버깅용)
  getAllState() {
    return { ...this.state };
  }

  subscribe(key, callback) {
    if (typeof callback !== 'function') {
      console.warn('Callback must be a function');
      return;
    }

    if (!this.observers[key]) {
      this.observers[key] = [];
    }
    this.observers[key].push(callback);
  }

  unsubscribe(key, callback) {
    if (this.observers[key]) {
      this.observers[key] = this.observers[key].filter(
        (obs) => obs !== callback
      );
    }
  }

  notify(key, value) {
    this.observers[key]?.forEach((callback) => {
      try {
        callback(value);
      } catch (error) {
        console.error(`Error in state observer for ${key}:`, error);
      }
    });
  }

  // 상태 초기화
  reset() {
    this.state = {};
    this.observers = {};
  }
}

export const appState = new State();

// 바닐라 자바스크립트로 컴포넌트를 만들 수 있게 하는 파일
// 이 컴포너트 클래스를 기준으로 다른 컴포넌트들을 만들 수 있으며 상태 관리를 통한 렌더링이 가능하다

export default class Component {
  $target; // 컴포넌트를 넣을 부모
  $props;
  $state;

  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.setEvent();
    this.render();
  }

  /**
   * 컴포넌트 state 설정
   */
  setup() {}

  /**
   * 컴포넌트가 마운트 되었을 때
   */
  mounted() {}

  /**
   * UI 구성
   */
  template() {}

  /**
   * 렌더링 함수
   */
  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  /**
   * 컴포넌트에서 필요한 이벤트 설정
   */
  setEvent() {}

  /**
   * 상태 변경 후 렌더링
   * @param newState
   */
  setState(newState) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }

  /**
   * 이벤트 등록 추상화
   * @param eventType
   * @param selector
   * @param callback
   */
  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}

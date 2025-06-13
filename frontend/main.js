// 여기에 실제로 사용되는 SPA JS 코드들을 import 한다.

// 이제 앱 불러온다.
const $app = document.querySelector('.App');

const routes = {
  '/': Home,
  '/about': About,
};

$app.innerHTML = routes['/'].template();

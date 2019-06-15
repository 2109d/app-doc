// 이벤트 핸들러를 받아 이벤트 리스너 등록
ctrl.on.button = ctrl.handler();
ctrl.on.button.event('click', function(evt) {
  alert('click event');
});

// 이벤트 체이닝으로 이벤트 리스너 등록
ctrl.on.input = ctrl.handler().event('focus', function(evt) {
  alert('focus event');
}).event('blur', function() {
  alert('blur event');
});

app.directive('focus', function(ctrl, el, param) {
  // focus 디렉티브에 전달된 확인
  ctrl.log('focus param:', param);
  // 화면 시작시 특정값으로 포커스 이동
  if(param == 'target') {
    el.focus();
  }
});

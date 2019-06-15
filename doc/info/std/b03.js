app.view('viSample', function(ctrl) {
  // 컴포넌트 인스턴스
  var comSample = app.ctrl.comSample;
  comSample.vo.view('viSample');

  // 이벤트 핸들러
  ctrl.on.popup = ctrl.handler();
  // 클릭이벤트 등록
  ctrl.on.popup.event('click', function() {
    // 팝업 시작
    ctrl.open('popSample');
  });
});
app.popup('popSample', function(ctrl, param) {
  // 컴포넌트 인스턴스
  var comSample = app.ctrl.comSample;
  comSample.vo.popup('popSample');

  // 화면 렌더링 템플릿
  ctrl.url = 'popup.html';

  // 이벤트 핸들러
  ctrl.on.close = ctrl.handler();
  // 클릭이벤트 등록
  ctrl.on.close.event('click', function() {
    // 팝업 종료
    ctrl.close();
  });
});
app.component('comSample', function(ctrl) {
  // 화면 렌더링 템플릿
  ctrl.html = '&lt;div data-bind="text:vo.view"&gt;view&lt;/div&gt;&lt;div data-bind="text:vo.popup"&gt;popup&lt;/div&gt;';
  // 화면 바인딩 변수 선언
  ctrl.vo.view = ctrl.observer('');
  ctrl.vo.popup = ctrl.observer('');
});
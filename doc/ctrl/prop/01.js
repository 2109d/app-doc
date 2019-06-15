app.view('viSample', function(ctrl) {
  var type = ctrl.type;    // 컨트롤러 타입
  var name = ctrl.name;    // 컨트롤러 이름
  ctrl.log('controll type: ' + type, 'name: ' + name);

  // html템플릿으로 랜더링
  ctrl.html = '&lt;button data-bind="text:vo.btnName, event:on.btnEvent"&gt;open popup&lt;/button&gt;';
  // 뷰 시작시 호출
  ctrl.onload = function() {
    // 컨트롤러에 바인딩된 엘리먼트 배경색 변경
    ctrl.el.style.background = '#f00';
  };

  // 버튼 텍스트값 변경을 위한 연결
  ctrl.vo.btnName = ctrl.observer('open popup');
  // 버튼 이벤트 연결
  ctrl.on.btnEvent = ctrl.handler().event('click', function(event) {
    var param = {};
    // 팝업 오픈 및 파라메터 전달
    ctrl.open('popSample', param).then(function(result) {
      // 팝업 종료 후 결과값 출력
      ctrl.log('popup close', result);
    });
  });
});

app.popup('popSample', function(ctrl, param) {
  // 팝업을 오픈한 부모 컨트롤러
  var parent = ctrl.parent;
  ctrl.url = 'pop-template.html';
  // 팝업 종료시 호출
  ctrl.onclose = function() {
    // 부모 컨트롤러의 배경색 변경
    parent.el.style.background = '#00f';
  };

  ctrl.log('parent name: ' + parent.name, 'param: '+param);
  // 버튼 이벤트 연결
  ctrl.on.btnClose = ctrl.handler().event('click', function(event) {
    var result = {};
    // 팝업 종료 및 결과값 전달
    ctrl.close(result);
  });
});

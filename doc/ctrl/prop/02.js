app.view('step1', function(ctrl) {
  // 로그 출력
  ctrl.log('viSample open');
  // id값 추가
  ctrl.attr({id: 'viStep1'});
  // step1 클래스 추가
  ctrl.css({step1:true});
  // 스타일 변경
  ctrl.style({background:'#f00'});

  // 변수 바인딩 객체 반환
  ctrl.vo.title = ctrl.observer('');
  // 이벤트 핸들러 취득
  ctrl.on.setList = ctrl.handler();
  // 이벤트 리스너 등록
  ctrl.on.setList.event('click', function(event) {
    // 바인된 변수 값을 화면에 출력
    ctrl.vo.title('set title');
  });
  // 이벤트 핸들러 반환 및 체이닝을 통한 리스너 등록
  ctrl.on.getTitle = ctrl.handler().then('click', function(event) {
    // 화면으로 부터 전달받은 값
    ctrl.log('get title', ctrl.vo.title());
  });

  ctrl.on.step2 = ctrl.handler().event('click', function(event) {
    ctrl.active(false);    // step2 오픈, step1 화면 삭제
    ctrl.open('step2').then(function() {
      ctrl.active(true);   // step2 종료, step1 화면 랜더링
    });
  });
});
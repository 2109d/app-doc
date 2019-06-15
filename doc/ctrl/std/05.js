// 뷰 컨트롤러
app.view('viName', function(ctrl) {
  ctrl.on.openPopup = ctrl.handler().event('click', function(evt) {
    var param = {type: 'view'};
    // 팝업컨트롤러 오픈
    ctrl.open('popName', param).then(function(result) {
      // 팝업종료시 전달된 결과물
      ctrl.log('popName close:', result);
    });
  });
});

// 팝업 컨트롤러
app.popup('popName', function(ctrl, param) {
  ctrl.on.close = ctrl.handler().event('click', function(evt) {
    var result = {type: 'popup'};
    // 팝업을 종료 하며, 결과물을 오픈한 대상에 넘겨 준다.
    ctrl.close(result);
  });
});

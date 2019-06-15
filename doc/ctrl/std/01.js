// 뷰 컨트롤러 등록
app.view('viewName', function(ctrl) {
  // popupName 팝업 컨트롤러
  var popupName = app.ctrl.popupName;
  popupName.setTitle('change title');
});

// 팝업 컨트롤러 등록
app.popup('popupName', function(ctrl) {
  ctrl.vo.title = ctrl.observer('');
}, function(extend) {
  // 팝업 컨트롤러에 setTitle 메소드 추가
  extend.setTitle = function(title) {
    ctrl.vo.title(title);
  };
});

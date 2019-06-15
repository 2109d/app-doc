!function(app) {
app.view('viStep2', function(ctrl) {
  // - properties -
  ctrl.url = app.path('/demo/view/vi-step2.html');
  ctrl.onload = function() {
    ctrl.el.focus();
  };

  // - value -
  var vo = ctrl.vo;
  vo.trgName = ctrl.observer('');
  vo.trgTel = ctrl.observer('');

  // - event -
  var on = ctrl.on;
  on.prev = ctrl.handler().event('click', function() {
    ctrl.close();
  });
  on.next = ctrl.handler().event('click', function() {
    if(!vo.trgName.$data) return ctrl.alert('이름을 입력하세요.').then(function() {
      ctrl.movepoint('trgName');
    });
    if(vo.trgTel.$length < 11) return ctrl.alert('연락처를 입력하세요.').then(function() {
      ctrl.movepoint('trgTel');
    });

    var comInfo = app.ctrl.comInfo;
    comInfo.vo.trgName(vo.trgName.$data);
    comInfo.vo.trgTel(vo.trgTel.$data);

    ctrl.active = false;
    ctrl.open('viStep3').then(function() {
      ctrl.active = true;
    });
  });
});
}(MakeApp());
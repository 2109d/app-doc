!function(app) {
app.view('viStep2', function(ctrl) {
  var viStep3 = app.controller('viStep3');
  var comInfo = app.controller('comInfo');

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
    if(!vo.trgName.$data) return app.alert(ctrl, '이름을 입력하세요.').then(function() {
      ctrl.get.movepoint('trgName');
    });
    if(vo.trgTel.$length < 11) return app.alert(ctrl, '연락처를 입력하세요.').then(function() {
      ctrl.get.movepoint('trgTel');
    });

    ctrl.active = false;
    comInfo.vo.trgName(vo.trgName.$data);
    comInfo.vo.trgTel(vo.trgTel.$data);
    viStep3.open(ctrl).then(function() {
      ctrl.active = true;
    });
  });
});
}(MakeApp());
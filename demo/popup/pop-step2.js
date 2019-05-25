!function(app) {
app.popup('popStep2', function(ctrl, param) {
  if(!param) return app.alert(ctrl, '조회 내용을 확인 하세요.')
    .then(function() { ctrl.close(); });

  var popZipcode = app.controller('popZipcode');
  var popStep3 = app.controller('popStep3');

  // - properties -
  ctrl.css = {view:true};
  ctrl.url = app.path('/demo/popup/pop-step2.html');

  // - value -
  var vo = ctrl.vo;
  vo.mp = ctrl.observer('');
  vo.srcId = ctrl.observer(param.id);
  vo.srcName = ctrl.observer(param.name);
  vo.srcTel = ctrl.observer(param.tel);

  vo.trgName = ctrl.observer('');
  vo.trgTel = ctrl.observer('');
  vo.trgZipcode = ctrl.observer('');
  vo.trgDefAddr = ctrl.observer('');
  vo.trgDtlAddr = ctrl.observer('');

  // - event -
  var on = ctrl.on;
  on.zipcode = ctrl.handler().event('click', function() {
    popZipcode.open(ctrl).then(function(data) {
      if(!data) return;
      vo.trgZipcode.$data = data.code;
      vo.trgDefAddr.$data = data.doro;
    });
  });
  on.close = ctrl.handler().event('click', function() {
    ctrl.close();
  });
  on.next = ctrl.handler().event('click', function() {
    if(!vo.trgName.$data)
      return app.alert(ctrl, '이름을 입력하세요.').then(function() {
        ctrl.get.movepoint('trgName');
      });
    if(!/^\d{10,11}$/.test(vo.trgTel.$data))
      return app.alert(ctrl, '연락처(숫자)를 10자 또는 11자로 입력하세요.').then(function() {
        ctrl.get.movepoint('trgTel');
      });
    if(!vo.trgZipcode.$data)
      return app.alert(ctrl, '주소를 입력하세요.').then(function() {
        ctrl.get.movepoint('trgZipcode');
      });
    if(!vo.trgDtlAddr.$data)
      return app.alert(ctrl, '세부주소를 입력하세요.').then(function() {
        ctrl.get.movepoint('trgDtlAddr');
      });

    popStep3.open(ctrl, {
      srcId: param.id,
      srcName: param.name,
      srcTel: param.tel,
      trgName: vo.trgName.$data,
      trgTel: vo.trgTel.$data,
      trgZipcode: vo.trgZipcode.$data,
      trgDefAddr: vo.trgDefAddr.$data,
      trgDtlAddr: vo.trgDtlAddr.$data
    });
  });
});
}(MakeApp());
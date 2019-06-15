!function(app) {
app.view('viStep1', function(ctrl) {
  var http = ctrl.http(), util = ctrl.util();

  // - properties -
  ctrl.url = app.path('/demo/view/vi-step1.html');
  ctrl.onload = function() {
    ctrl.el.focus();
    ctrl.log(1, 'a', {}, []);
    // app.trace.stack(app.trace.error());
  };

  // - value -
  var vo = ctrl.vo;
  vo.id = ctrl.observer('test');
  vo.isSearch = ctrl.observer(false);
  vo.list = ctrl.observer([]);

  // - event -
  var on = ctrl.on;
  on.search = ctrl.handler().event('click', function() {
    if(vo.id.$length < 4) return ctrl.alert('아이디를 4자이상 입력하세요.').then(function() {
      ctrl.movepoint('id');
    });

    vo.isSearch(true);
    vo.list.removeAll();
    http.get(app.path('/demo/member.json')).then(function(data) {
      data.forEach(function(vl) {
        RegExp(vo.id.$data).test(vl.id) && vo.list.push(util.assign(vl, {
          active: ctrl.observer(false),
          selected: listSelected
        }));
      });
    });

    var listSelected = ctrl.handler().event('click', function(ev, vl) {
      vo.list.$data.forEach(function(itm, idx) {
        itm.active(idx == vo.list.indexOf(vl));
      });
    });
  });

  on.next = ctrl.handler().event('click', function() {
    var item;
    vo.list.$data.some(function(vl) {
      return vl.active.$data && (item = vl);
    });
    if(!item) return ctrl.alert('조회항목을 선택하세요.');

    var comInfo = app.ctrl.comInfo;
    comInfo.vo.srcName(item.name);
    comInfo.vo.srcTel(item.tel);

    ctrl.active = false;
    ctrl.open('viStep2').then(function() {
      ctrl.active = true;
      ctrl.movepoint('next');
    });
  });

});
}(MakeApp('viStep1'));
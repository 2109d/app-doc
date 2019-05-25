!function(app) {
app.view('viStep1', function(ctrl) {
  var viStep2 = app.controller('viStep2');
  var comInfo = app.controller('comInfo');
  var http = app.http, assign = app.util.assign;

  // - properties -
  ctrl.url = app.path('/demo/view/vi-step1.html');
  ctrl.onload = function() {
    ctrl.el.focus();
    ctrl.log(1, 'a', {}, []);
  };

  // - value -
  var vo = ctrl.vo;
  vo.id = ctrl.observer('test');
  vo.isSearch = ctrl.observer(false);
  vo.list = ctrl.observer([]);

  // - event -
  var on = ctrl.on;
  on.search = ctrl.handler().event('click', function() {
    if(vo.id.$length < 4) return app.alert(ctrl, '아이디를 4자이상 입력하세요.').then(function() {
      ctrl.get.movepoint('id');
    });

    vo.isSearch(true);
    vo.list.removeAll();
    http.get(ctrl, app.path('/demo/member.json')).then(function(data) {
      data.forEach(function(vl) {
        RegExp(vo.id.$data).test(vl.id) && vo.list.push(assign(vl, {
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
    if(!item) return app.alert(ctrl, '조회항목을 선택하세요.');

    ctrl.active = false;
    comInfo.vo.srcName(item.name);
    comInfo.vo.srcTel(item.tel);
    viStep2.open(ctrl).then(function() {
      ctrl.active = true;
    });
  });

});
}(MakeApp('viStep1'));
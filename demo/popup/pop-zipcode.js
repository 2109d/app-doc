!function(app) {
app.popup('popZipcode', function(ctrl) {
  var http = ctrl.http(), util = ctrl.util();
  var active = {'btn-outline-info':false, ' btn-info':true};
  var inactive = {'btn-outline-info':true, ' btn-info':false};
  var _list = [];

  // - properties -
  ctrl.css({sheet:true});
  ctrl.url = app.path('/demo/popup/pop-zipcode.html');
  http.get(app.path('/demo/zipcode.json')).then(function(data) {
    _list = [].concat(data);
    vo.list(data);
  });

  // - value -
  var vo = ctrl.vo;
  vo.keyword = ctrl.observer('');
  vo.doro = ctrl.observer(inactive);
  vo.jibun = ctrl.observer(inactive);
  vo.list = ctrl.observer([]);

  // - event - 
  var on = ctrl.on;
  on.close = ctrl.handler().event('click', function() {
    ctrl.close();
  });
  on.doro = ctrl.handler().event('click', function() {
    vo.keyword.$data = '중앙로';
    vo.doro(util.assign({}, active));
    vo.jibun(util.assign({}, inactive));

    vo.list.removeAll();
    _list.forEach(function(vl) {
      RegExp(vo.keyword.$data).test(vl.doro) && vo.list.push(vl);
    });
  });
  on.jibun = ctrl.handler().event('click', function() {
    vo.keyword.$data = '역삼동';
    vo.doro(util.assign({}, inactive));
    vo.jibun(util.assign({}, active));

    vo.list.removeAll();
    _list.forEach(function(vl) {
      RegExp(vo.keyword.$data).test(vl.jibun) && vo.list.push(vl);
    });
  });
  on.selected = ctrl.handler().event('click', function(ev, vl) {
    ctrl.close(vl);
  });
});
}(MakeApp());
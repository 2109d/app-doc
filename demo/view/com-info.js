!function(app) {
app.component('comInfo', function(ctrl) {
  ctrl.url = app.path('/demo/view/com-info.html');

  // - value -
  var vo = ctrl.vo;
  vo.srcName = ctrl.observer('');
  vo.srcTel = ctrl.observer('');
  vo.trgName = ctrl.observer('');
  vo.trgTel = ctrl.observer('');
});
}(MakeApp());
!function(app) {
app.popup('popStep3', function(ctrl, param) {
  // - properties -
  ctrl.css({view:true});
  ctrl.url = app.path('/demo/popup/pop-step3.html');

  // - value -
  var vo = ctrl.vo;
  vo.out = ctrl.observer(param);

  // - event -
  var on = ctrl.on;
  on.complite = ctrl.handler().event('click', function() {
    ctrl.finished();
  });
}, function(ex) {
  ex.finished = function(ctrl) {
    location.href = app.path('/demo-popup.html');
  };
});
}(MakeApp());
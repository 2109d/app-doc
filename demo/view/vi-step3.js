!function(app) {
app.view('viStep3', function(ctrl) {
  // - properties -
  ctrl.url = app.path('/demo/view/vi-step3.html');

  // - value -
  var vo = ctrl.vo;

  // - event -
  var on = ctrl.on;
  on.complite = ctrl.handler().event('click', function() {
    ctrl.get.endstep();
  });
}).set('endstep', function() {
  location.href = app.path('/demo-view.html');
});
}(MakeApp());
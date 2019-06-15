!function(app) {
app.view('viStep3', function(ctrl) {
  // - properties -
  ctrl.url = app.path('/demo/view/vi-step3.html');
  ctrl.onload = function() {
    ctrl.el.focus();
  };

  // - event -
  var on = ctrl.on;
  on.complite = ctrl.handler().event('click', function() {
    ctrl.finished();
  });
}, function(ex) {
  ex.finished = function() {
    location.href = app.path('/demo-view.html');
  };
});
}(MakeApp());
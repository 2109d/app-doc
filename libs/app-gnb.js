!function(app) {
app.view('navTop', function(ctrl, param) {
  ctrl.url = app.path('/doc/nav-top.html');

  // - value -
  var vo = ctrl.vo;
  vo.home = ctrl.observer(app.path('/'));
  vo.list = ctrl.observer([]);
  vo.menu = ctrl.observer(false);

  // - event -
  var on = ctrl.on;
  on.menu = ctrl.handler().event('click', function() {
    vo.menu(!vo.menu.$data);
  });
}, function(extend) {
  extend.setMenu = function(ctrl, vl) {
    ctrl.vo.list(vl);
  };
});

app.view('navSide', function(ctrl, param) {
  var util = ctrl.util();
  ctrl.url = app.path('/doc/nav-side.html');

  // - value -
  var vo = ctrl.vo;
  vo.list = ctrl.observer([]);

  // - local scorpe -
  var http = ctrl.http({stealth:true});
  http.get(app.path('/doc/navi.json')).then(function(data) {
    var title, isActive;
    var path = app.param('path'), pathname = location.pathname;
    var menu = data.map(function(vl) {
      if(!isActive) title = vl.title;
      return util.assign(vl, {
        links: vl.links.map(function(vl) {
          if(!isActive) {
            isActive = path ? !!vl.url.match(path||'') : !!pathname.match(vl.url);
          }

          return util.assign(vl, {
            attr: {href: app.path(vl.url)},
            css: { active: path ? !!vl.url.match(path||'') : !!pathname.match(vl.url) }
          });
        })
      });
    });

    ctrl.vo.list(menu);
    app.ctrl.navTop.setMenu(menu);
  });
});
}(MakeApp(['navSide', 'navTop']));

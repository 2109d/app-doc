!function(app) {
  app.setTitle = function(main, sub) {
    document.title = 'MakeApp 가이드| ' + main + '-' + sub;
  };
  
  app.view('navSide', function(ctrl, param) {
    var navTop = app.controller('navTop');
    ctrl.url = app.path('/doc/nav-side.html');
  
    // - bind value -
    var vo = ctrl.vo;
    vo.list = ctrl.observer([]);
  
    // -- menu --
    var http = app.http;
    http.get(ctrl, app.path('/doc/navi.json'), null, {stealth:true}).then(function(data) {
      var title, isActive;
      var path = app.param.path, pathname = location.pathname;
      var menu = data.map(function(vl) {
        if(!isActive) title = vl.title;
        return app.util.assign(vl, {
          links: vl.links.map(function(vl) {
            if(!isActive) {
              isActive = path ? !!vl.url.match(path||'') : !!pathname.match(vl.url);
              isActive && app.setTitle(title, vl.title)
            }
  
            return app.util.assign(vl, {
              attr: {href: app.path(vl.url)},
              css: { active: path ? !!vl.url.match(path||'') : !!pathname.match(vl.url) }
            });
          })
        });
      });
  
      ctrl.vo.list(menu);
      navTop.get.setMenu(menu);
    });
  });
  
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
  }).set('setMenu', function(ctrl, vl) {
    ctrl.vo.list(vl)
  });
  
  }(MakeApp(['navSide', 'navTop']));
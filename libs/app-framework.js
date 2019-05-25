!function(app) {
app.debug(['localhost', '127.0.0.1']);
app.path = function(vl) { return (app.root||'') + '/' + (vl||'').replace(/^\//, ''); };
app.param = (function(search) {
  return search ? JSON.parse('{"'+
    search.replace(/=/g, '":"').replace(/&/g, '","')
  +'"}') : {};
})(location.search.replace(/^\?/, ''));
app.add('alert', function(ctrl, msg, ok) {
  return app.controller('popAlert').open(ctrl, {message:msg, ok:ok});
});
app.add('confirm', function(ctrl, msg, ok, cancel) {
  return app.controller('popConfirm').open(ctrl, {message:msg, ok:ok, cancel:cancel});
});

// 디렉티브
app.directive('jscode', function(ctrl, el, prm) {
  el.innerHTML = '<div class="text-right text-secondary">javascrit</div>' +
    el.innerHTML.replace(
      /(var |function|return )|((\/\/.*)|(\/\*(.|\n?)*\*\/))/g,
      '<span class="text-primary">$1</span><span class="text-success">$2</span>'
    ).replace(/(\'([^\'\']+)?\')/g, '<span class="text-danger">$1</span>')
});
app.directive('csscode', function(ctrl, el, prm) {
  el.innerHTML = '<div class="text-right text-secondary">css</div>' +
    el.innerHTML.replace(/((.*){)/g, '<b class="text-info">$2</b>{').replace(/(.*:)/g, '<b>$1</b>');
});
app.directive('htmlcode', function(ctrl, el, prm) {
  el.innerHTML = '<div class="text-right text-secondary">html</div>' +
    el.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/=""/g, '')
      .replace(/"([^""]+)"/g, '<span class="text-danger">"$1"</span>')
      .replace(/(data-bind|data-app-[\w]+)/g, '<span class="text-info">$1</span>')
      .replace(/(&lt;\!--.*--&gt;)/g, '<span class="text-success">$1</span>')
});

// - waypoint directive -
app.set('wp', null).set('waypoint', function(ctrl) {
  var wp = ctrl.get.wp;
  wp instanceof Element && wp.focus();
}).directive('waypoint', function(ctrl, el, prm) {
  ctrl.get.wp && ctrl.get.wp.outerHTML == el.outerHTML && el.focus();
  el.addEventListener('click', function() {
    ctrl.get.wp = el;
  });
});

// - movepoint directive -
app.set('mpList', []).set('movepoint', function(ctrl, vl) {
  var mp;
  setTimeout(function() {
    ctrl.get.mpList.some(function(el) {
      var movepoint = (el.dataset || {}).movepoint;
      return (mp = el), movepoint == vl;
    }) && mp.focus();
  }, 100);
}).directive('movepoint', function(ctrl, el, prm) {
  ctrl.get.mpList.push(el);
});

app.directive('phonenumber', function(ctrl, el, prm) {
  var format = function(vl) { return vl.replace(/(\d{3})(\d{4}|\d{3})(\d{4})/, '$1-$2-$3'); };
  if(typeof prm == 'string') {
    el.innerText = format(prm||'');
  } else {
    el.innerText = format(prm.$data||'');
    prm.subscribe(function(vl) {
      el.innerText = format(vl||'');
    });
  }
});


// 디폴트 팝업
app.popup('popAlert', function(ctrl, prm) {
  ctrl.url = app.path('/doc/pop-alert.html');
  ctrl.css = {modal:true};

  ctrl.vo.message = ctrl.observer(prm.message ||'');
  ctrl.vo.ok = ctrl.observer(prm.ok ||'확인');
  ctrl.on.ok = ctrl.handler().event('click', function() {
    ctrl.close();
  });
});
app.popup('popConfirm', function(ctrl, prm) {
  ctrl.url = app.path('/doc/pop-confirm.html');
  ctrl.css = {modal:true};

  ctrl.vo.message = ctrl.observer(prm.message ||'');
  ctrl.vo.ok = ctrl.observer(prm.ok ||'확인');
  ctrl.vo.cancel = ctrl.observer(prm.cancel ||'취소');
  ctrl.on.ok = ctrl.handler().event('click', function() { ctrl.close(true); });
  ctrl.on.cancel = ctrl.handler().event('click', function() { ctrl.close(false); });
});

// trigger
app.openTrigger = function(ctrl) {
  // 히스토리 적재
  history.pushState({ctrlName:ctrl.name}, '');
  location.href = [
    location.origin, location.pathname, '#',
    ctrl.type.toLowerCase(), '-', ctrl.name
  ].join('');
};
app.closeTrigger = function(ctrl) {
  // 히스토리 삭제
  var hash = location.hash.substr(location.hash.indexOf('-')+1);
  hash == ctrl.name && history.back();

  // waypoint 디렉티브 호출
  var waypoint = ctrl.parent && ctrl.parent.get.waypoint;
  waypoint && waypoint();

  // 마지막 스텝 처리
  ctrl.get.endstep && ctrl.get.endstep();
};
app.router(function(ev) {
  var state=ev.state, ctrlName=(state||{}).ctrlName;
  var ctrl = ctrlName && app.controller(ctrlName);
  ctrl && ctrl.close();
});
}(MakeApp());
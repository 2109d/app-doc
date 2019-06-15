!function(app) {
app.debug(['localhost', '127.0.0.1']);
app.param = function(ky){
  var search = location.search.replace(/^\?/, '').replace(/=/g, '":"').replace(/&/g, '","');
  var prm = search ? JSON.parse('{"'+search+'"}') : {};
  return ky ? prm[ky] : prm;
};

// 디렉티브
app.directive('example', function(ctrl, el, prm) {
  var js = function(vl) {
    return '<div class="text-right text-secondary">javascrit</div>' +
    vl.replace(/(var |function ?|return )|(\'(?:[^\']+)?\')|((\/\/.*)|(\/\*(?:[^\*]+)\*\/))/g, function(_,$1,$2,$3) {
      switch(true){
      case !!$1: return '<span class="text-primary">'+$1+'</span>';
      case !!$2: return '<span class="text-danger">'+$2+'</span>';
      case !!$3: return '<span class="text-success">'+$3+'</span>';
      default: return '';
      }
    });
  };
  var css = function(vl) {
    return '<div class="text-right text-secondary">css</div>'+
    vl.replace(/(?:(.*){)|(?:(.*) ?:)|(\/\*.*\*\/)/g, function(_,$1,$2,$3) {
      switch(true){
      case !!$1: return '<span class="text-info">'+$1+'</span>{';
      case !!$2: return '<span class="text-primary">'+$2+'</span>:';
      case !!$3: return '<span class="text-success">'+$3+'</span>:';
      default: return '';
      }
    });
  };
  var html = function(vl) {
    return '<div class="text-right text-secondary">html</div>'+
    vl.replace(/(<)|(>)|(="")|"([^""]+)"/g, function(_,$1,$2,$3,$4) {
      switch(true) {
      case !!$1: return '&lt;';
      case !!$2: return '&gt;';
      case !!$3: return '';
      case !!$4: return '<span class="text-danger">"'+$4+'"</span>';
      default: return '';
      }
    }).replace(/(data-bind|data-app-[\w]+)|(&lt;\!--.*--&gt;)/g, function(_,$1,$2) {
      switch(true) {
      case !!$1: return '<span class="text-info">'+$1+'</span>';
      case !!$2: return '<span class="text-success">'+$2+'</span>';
      default: return '';
      }
    });
  };
  prm && fetch(app.path(prm)).then(function(v){return v.text()}).then(function(txt) {
    el.innerHTML = prm.replace(/(.*\.js$)|(.*\.css$)|(.*\.html$)/, function(_,$1,$2,$3) {
      return ($1 && js(txt)) || ($2 && css(txt)) || ($3 && html(txt));
    });
  });
});

// - movepoint directive -
app.extend.mpElement = {};
app.extend.movepoint = function(ctrl, id) {
  var el = ctrl.mpElement[id];
  el && el.focus();
};
app.directive('movepoint', function(ctrl, el, prm) {
  if(prm) ctrl.mpElement[prm] = el;
});

// - waypoint directive -
app.extend.wpElement = [];
app.extend.waypoint = function(ctrl) {
  var wpElement = ctrl.parent && ctrl.parent.wpElement;
  var el = wpElement && wpElement.pop();
  el && el.focus();
};
app.directive('waypoint', function(ctrl, el, prm) {
  el.addEventListener('click', function() {
    ctrl.wpElement.length = 0;
    ctrl.wpElement.push(el);
  });
});

// 디폴트 팝업
app.popup('popAlert', function(ctrl, prm) {
  ctrl.url = app.path('/doc/pop-alert.html');
  ctrl.css({modal:true});

  ctrl.vo.message = ctrl.observer(prm.message ||'');
  ctrl.vo.ok = ctrl.observer(prm.ok ||'확인');
  ctrl.on.ok = ctrl.handler().event('click', function() { ctrl.close(); });
});
app.extend.alert = function(ctrl, msg, opt) {
  return ctrl.open('popAlert', {message:msg, opt:opt});
};
app.popup('popConfirm', function(ctrl, prm) {
  ctrl.url = app.path('/doc/pop-confirm.html');
  ctrl.css({modal:true});

  ctrl.vo.message = ctrl.observer(prm.message ||'');
  ctrl.vo.ok = ctrl.observer(prm.ok ||'확인');
  ctrl.vo.cancel = ctrl.observer(prm.cancel ||'취소');
  ctrl.on.ok = ctrl.handler().event('click', function() { ctrl.close(true); });
  ctrl.on.cancel = ctrl.handler().event('click', function() { ctrl.close(false); });
});
app.extend.confirm = function(ctrl, msg, opt) {
  return ctrl.open('popConfirm', {message:msg, opt:opt});
};

// trigger
app.ctrlOpen = function(ctrl) {
  // 히스토리 적재
  history.pushState({ctrlName:ctrl.name}, '');
  location.href = location.origin+ location.pathname+ '#'+ ctrl.type+ '-'+ ctrl.name;
};
app.ctrlClose = function(ctrl) {
  // 히스토리 삭제
  var ctrlName = location.hash.split('-').pop();
  ctrl.name == ctrlName && history.back();
  // waypoint 호출
  ctrl.waypoint && ctrl.waypoint();
  // 마지막 스텝 처리
  ctrl.finished && ctrl.finished();
};
// 라우터
app.router = function(ev) {
  var state=ev.state, ctrlName=(state||{}).ctrlName;
  var ctrl = ctrlName && app.ctrl[ctrlName];
  ctrl && ctrl.close();
};
}(MakeApp());

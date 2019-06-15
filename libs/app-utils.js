!function(app) {
  Array.first || Object.defineProperties(Array.prototype, {
    first: {get: function() {return this[0]}}
  });
  Array.last || Object.defineProperties(Array.prototype, {
    last: {get: function() {return this[this.length-1]}}
  });
  Array.prototype.reverseFor = Array.reverseFor || function(proc) {
    var length = this.length;
    while(--length) { proc && proc(this[length]); }
  };

  // util
  var util = {};
  var assign = util.assign = function() { return Object.assign.apply(Object, arguments); };
  var entries = util.entries = function(vl) { return Object.entries(vl); };
  var istype = util.istype = function(vl, tp) { return Array.isArray(vl) && tp == 'array' ? true : typeof vl == tp; };
  var clone = util.clone = function(vl) { return istype(vl, 'array') ? [].concat(vl) : assign({}, vl); };
  app.extend.util = function() { return util; };

  // http
  var ajax = function(url, request) {
    return fetch(url, request).then(function(rs) {
      var isJson = /application\/json/.test(rs.headers.get('Content-Type'));
      var data = isJson ? rs.json() : rs.text();
      return data.then(function(data){
        return {status:rs.status, data:data};
      });
    });
  };
  var urlParams = function(url, param) {
    var vl = entries(param||{}).reduce(function(qry, ent) {
      var ky=ent[0], vl=ent[1];
      return (istype(vl, 'array') ?
        vl.forEach(function(v) {qry.push(ky +'='+ encodeURIComponent(v))}) :
        qry.push(ky +'='+ encodeURIComponent(vl))
      ),qry;
    }, []).join('&');
    if(!url) return vl;
    return url + (vl ? '?'+vl : '');
  };
  var postParams = function(vl) { return vl && encodeURIComponent(JSON.stringify(vl)); };
  var http = function(ctrl, stealth, hierarchy) {
    assign(this, {
      _ctrl: ctrl,
      _stealth: stealth,
      _hierarchy: hierarchy,
      _progress: null,
      _request: null
    });
  };
  http.prototype.progressOn = function() {
    var _stealth=this._stealth, _progress=this._progress;
    if(_stealth || _progress) return this;

    var progressbar = app.insertResource();
    progressbar.setAttribute('data-app-loadingbar', '');

    var prog = progressbar.appendChild(document.createElement('div'));
    prog.classList.add('progress');
    prog.classList.add('rounded-0');

    var bar = prog.appendChild(document.createElement('div'));
    bar.classList.add('progress-bar');
    bar.classList.add('progress-bar-striped');
    bar.classList.add('progress-bar-animated');
    bar.style.width = '100%';

    return assign(this, {_progress:progressbar});
  };
  http.prototype.progressOff = function() {
    var _stealth=this._stealth, _progress=this._progress;
    if(_stealth) return this;

    app.removeResource(_progress);
    return assign(this, {_progress:null});
  };
  http.prototype.rqlog = function() {
    if(!this._source) return;
    var method=this._source.method, url=this._source.url, data=this._source.param;
    var _hierarchy = this._hierarchy;
    var _ctrl = this._ctrl||{};
    app.trace.option({
      label: '[' +method+ ':request:'+_ctrl.name+'] ' +(url||''),
      color:'#07f'
    }).log(_hierarchy ? JSON.stringify(data,'','  ') : data);
  };
  http.prototype.rslog = function(data) {
    if(!this._source) return;
    var method=this._source.method, url=this._source.url;
    var _hierarchy = this._hierarchy;
    var _ctrl = this._ctrl||{};
    app.trace.option({
      label: '[' +method+ ':response:'+_ctrl.name+'] ' + (url||''),
      color:'#2a4'
    }).log(_hierarchy ? JSON.stringify(data,'','  ') : data);
  };
  http.prototype.erlog = function(data) {
    if(!this._source) return;
    var method=this._source.method, url=this._source.url, param=this._source.param;
    var _ctrl = this._ctrl||{};
    app.trace.option({
      label: '[' +method+ ':error:'+_ctrl.name+'] ' + (url||'')
    }).error({param:param, error:data});
  };
  http.prototype.setSource = function(vl) {
    return assign(this, {_source:vl});
  };
  http.prototype.setRequest = function(vl) {
    return assign(this, {_request: assign({method:'GET', credentials:'include'}, vl)});
  };
  http.prototype.send = function(url) {
    var _this = this;
    var _request = this._request;

    _this.progressOn().rqlog();
    return ajax(url, _request).then(function(result) {
      var status=result.status, data=result.data;
      if(status == 200) {
        _this.progressOff().rslog(result);
        return data;
      } else throw result;
    }).catch(function(error) {
      var data = error.data||{};
      var code = data.code || '';
      var message = data.message || '통신오류';

      _this.progressOff().erlog(error);
      return _this._ctrl.alert(message+'['+code+']').then(function() {throw error;});
    });
  };
  // ----- public ----- //
  http.prototype.get = function(url, param) {
    return this.setSource({method:'GET', url:url, param:param})
    .setRequest({method:'GET'})
    .send(urlParams(url, param));
  };
  http.prototype.post = function(url, param) {
    return this.setSource({method:'POST', url:url, param:param})
    .setRequest({method:'POST', body:postParams(param)})
    .send(url);
  };
  http.prototype.submit = function(url, param) {
    return this.setSource({method:'SUBMIT', url:url, param:param})
    .setRequest({
      method:'POST', body:urlParams(null,param),
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}
    }).send(url);
  };
  http.prototype.async = function(list) {
    var _this = this;

    _this.setSource({method:'ASYNC', param:list}).progressOn().rqlog();
    return Promise.all(list.map(function(vl) {
      var url=vl.url, param=vl.param, method=vl.method;
      var request={method:'GET', credentials:'include'};
      switch(method) {
      case 'POST': return ajax(url, assign(request, {method:'POST', body:postParams(param)}));
      case 'SUBMIT': return ajax(url, assign(request, {
          method:'POST', body:urlParams(null,param),
          headers:{'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'}
        }));
      case 'GET': default: return ajax(urlParams(url, param), request);
      }
    })).then(function(result) {
      var success = result.reduce(function(suc, vl) {
        return (vl.status == 200 && suc.push(vl.data)), suc;
      }, []);
      if(result.length == success.length) {
        _this.progressOff().rslog(result);
        return success;
      } else throw result;
    }).catch(function(error) {
      _this.progressOff().erlog(error);
      return _this._ctrl.alert('통신오류').then(function() {throw error;});
    });
  };
  app.extend.http = function(ctrl, option) {
    return new http(ctrl, (option||{}).stealth, (option||{}).hierarchy);
  };
}(MakeApp());

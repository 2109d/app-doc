!function(app) {
  // util
  var assign, entries, isType;
  app.add('util', (function(util){
    util.assign = assign = function() {
      arguments[0] = arguments[0] || {};
      return Object.assign.apply(Object, arguments);
    };
    util.entries = entries = function(vl) { return Object.entries(vl); }
    util.isType = isType = function(vl, type) {
      if(Array.isArray(vl) && type == 'array') return true;
      else return typeof vl == type;
    };
    var clone = util.clone = function(vl) {
      return isType(vl, 'array') ? [].concat(vl) : assign({}, vl);
    };
  
    return util;
  })({}));

  app.add('ajax', (function(ajax){
    ajax.get = function(ctrl, url) {
      return fetch(url).then(function(rs) {
        return /json/.test(rs.headers.get('Content-Type')) ? rs.json() : rs.text();
      });
    };
    return ajax;
  })({}));

  // http
  app.add('http', (function(http){
    var meta = {credentials:'include'};  // cors cookies
    var trace = app.trace, progressbar;
    var log = function(prm, opt) {
      trace.log((opt||{}).hierarchy ? JSON.stringify(prm,'','  ') : prm, opt);
    };
    var rqlog = function(ctrl, url, prm, opt) {
      var type=ctrl.type, name=ctrl.name;
      log(prm, assign(opt, {option:'http:request| '+type+':'+name+'| ' +url, color:'#07f'}));
    };
    var rslog = function(ctrl, url, rs, opt) {
      var type=ctrl.type, name=ctrl.name;
      log(rs, assign(opt, {option:'http:response| '+type+':'+name+'| ' +url, color:'#d34'}));
    };
    var erlog = function(ctrl, vl) {
      var data = vl.data.data||{};
      trace.error(vl.url, vl.data);
      app.alert(ctrl, data.message||vl.message).then(function() { reject(vl.data); });
    };

    var makeProgress = function(opt) {
      var stealth = (opt||{}).stealth;
      if(progressbar || stealth) return;

      progressbar = app.insertResource();
      progressbar.setAttribute('data-app-loadingbar', '');
  
      var prg = progressbar.appendChild(document.createElement('div'));
      prg.classList.add('progress');
      prg.classList.add('rounded-0');
  
      var bar = prg.appendChild(document.createElement('div'));
      bar.classList.add('progress-bar');
      bar.classList.add('progress-bar-striped');
      bar.classList.add('progress-bar-animated');
      bar.style.width = '100%';
    };
    var removeProgress = function(opt) {
      if((opt||{}).stealth) return;
      progressbar = app.removeResource(progressbar);
    };
    var urlParams = function(vl) {
      return entries(vl).reduce(function(url, ent) {
        var vl = ent.pop(), ky = ent.pop();
    
        if(isType(vl, 'array')) vl.forEach(function(v) { url.append(ky, v) });
        else if(isType(vl, 'object')) url.append(ky, JSON.stringify(vl));
        else url.append(ky, vl);

        return url;
      }, new URLSearchParams).toString();
    };
    var postParams = function(vl) { return vl && JSON.stringify(vl); };
    var formParams = function(vl) {
      return entries(vl).reduce(function(frm, ent) {
        var vl = ent.pop(), ky = ent.pop();
    
        if(isType(vl, 'array')) vl.forEach(function(v) { frm.append(ky, v) });
        else if(isType(vl, 'object')) frm.append(ky, JSON.stringify(vl));
        else frm.append(ky, vl);

        return frm;
      }, new FormData);
    };
    var ajax = function(url, meta) {
      return fetch(url, meta).then(function(rs) {
        var data = rs[/json/.test(rs.headers.get('Content-Type')) ? 'json' : 'text']();
        return data.then(function(data) {
          return {status:rs.status, data:data};
        });
      });
    };
    var query = function(ctrl, url, meta, opt) {
      makeProgress(opt);
      return new Promise(function(resolve, reject) {
        ajax(url, meta).then(function(rs) {
          var status = rs.status, data = rs.data;
          removeProgress(opt);
          if(data && status == 200) rslog(ctrl, url, rs, opt), resolve(data);
          else erlog(ctrl, {url, data:rs, message:'데이터수신 오류입니다.'});
        }).catch(function(err) {
          removeProgress(opt);
          erlog(ctrl, {url, data:{err}, message:'통신 오류입니다.'})
        });
      });
    };

    // http.get(ctrl, '/xxx.ajax', {}, {stealth, hierarchy});
    http.get = function(ctrl, url, prm, opt) {
      url += prm ? '?' + urlParams(prm).toString() : '';
      rqlog(ctrl, url, prm, opt);
      return query(ctrl, url, null, opt);
    };
    // http.post(ctrl, '/xxx.ajax', {}, {stealth, hierarchy});
    http.post = function(ctrl, url, prm, opt) {
      rqlog(ctrl, url, prm, opt);
      return query(ctrl, url, assign(meta, {
        method: 'post',
        body: postParams(prm)
      }), opt);
    };
    // http.submit(ctrl, '/xxx.ajax', {}, {stealth, hierarchy});
    http.submit = function(ctrl, url, prm, opt) {
      rqlog(ctrl, url, prm, opt);
      return query(ctrl, url, assign(meta, {
        method: 'post',
        body: urlParams(prm).toString(),
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        })
      }), opt);
    };
    // http.async(ctrl, [{url, param}], {stealth, hierarchy});
    http.async = function(ctrl, que, opt) {
      return new Promise(function(resolve, reject) {
        if(!isType(que, 'array')) return trace.error('http:error| param is array'), reject();
        var message = function(vl, def) {
          var urls = que.map(function(vl) { return vl.url; }).join(',');
          var msg = (vl[0] || {}).message;
          trace.error('http:error| '+urls, vl);
          app.alert(ctrl, msg || def).then(function() { reject(vl); });
        };

        makeProgress(opt);
        Promise.all(que.map(function(vl) {
          rqlog(ctrl, vl.url, vl.param, opt);
          return ajax(vl.url, assign(meta, {
            method:'post', body:postParams(vl.param)
          }));
        })).then(function(ls) {
          var data = ls.reduce(function(data, vl) {
            vl.status == 200 && data.push(vl.data);
            return data;
          }, []);

          removeProgress(opt);
          if(ls.length == data.length) resolve(ls.map(function(vl) {
              return rslog(ctrl, que.shift().url, vl, opt), vl.data;
            }));
          else message(ls, '통신 오류입니다.');
        }).catch(function(err) {
          removeProgress(opt);
          message([{err:err}], '통신 오류입니다.');
        });
      });
    };
    // http.upload = function() {formParams(prm)}
    return http;
  })({}));
}(MakeApp());

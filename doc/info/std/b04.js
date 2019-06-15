// 컨트롤러에 메소드 추가
app.extend.openLog = function(ctrl, text) {
  ctrl.log('open', text);
};
app.extend.closeLog = function(ctrl, text) {
  ctrl.log('close', text);
};

// 컨트롤러 오픈시 호출
app.ctrlOpen = function(ctrl) {
  ctrl.openLog('ctrlOpen trigger');
};
// 컨트롤러 종료시 호출
app.ctrlClose = function(ctrl) {
  ctrl.closeLog('ctrlClose trigger');
};

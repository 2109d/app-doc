// 날짜포멧 처리를 위한 디렉티브
app.directive('focus', function(ctrl/*컨트롤러*/, el/*엘리먼트객체*/, param/*전달받은값*/) {
  // 숫자를 날짜 포멧으로 변환후 텍스트값 출력
  el.innerText = param.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
});
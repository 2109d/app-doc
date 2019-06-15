app.trace.max = 10;
app.trace.log(1, 'a', {}, []);
// 에러로그 출력
app.trace.error('error');
// 저장된 로그 기록 취득
var errStack = app.trace.error();
app.trace.stack(errStack);
// 로그기록 삭제
app.trace.clear();

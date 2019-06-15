// app 인스턴스
var app = MakeApp();
// 실행할 컨트롤러 명시
var app = MakeApp('v1');
// 다건인 경우 배열을 사용
varapp = MakeApp(['v1', 'v2']);

app.view('v1', function(ctrl){});
app.view('v2', function(ctrl){});

// 1. #layer 앞에 추가
var before = app.insertResource('#layer', 'before');
before.setAttribute('id', 'before');
// 2. #before 뒤에 추가
app.insertResource(before, 'after');
// 3. 리소스 마지막에 추가
app.insertResource();

// [data-app-resource] 취득
var rsc = app.getResource();
// #layer 취득
var layer = app.getResource('#layer');

// #layer 삭제
app.removeResource('#layer');

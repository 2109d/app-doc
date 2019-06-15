app.require('v1.js');
app.require(['v1.js', 'v2.js']);

// v1.js
// requre로 로드된 스크립트안에서 require 사용불가
<strike>app.require('v2.js');</strike>

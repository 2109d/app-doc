ctrl.vo.inputValue = ctrl.observer('출력');
ctrl.vo.option = ctrl.observer('1');

// 화면으로 부터 입력된 값
var inputValue = ctrl.vo.inputValue();
alert(inputValue);

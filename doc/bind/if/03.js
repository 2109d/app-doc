// 리스트값 선언
ctrl.vo.list = ctrl.observer([{
  text:'셀렉트 1번',
  select:[
    {text:'옵션 1번', value:'1'},
    {text:'옵션 2번', value:'2'}
  ]
}]);

// 추가
ctrl.vo.list.push({
  text:'셀렉트 2번',
  select:[
    {text:'옵션 1번', value:'1'},
    {text:'옵션 2번', value:'2'}
  ]
});


apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
}

function onOpenSelect() {
  api.openWin({
      name: 'equipmentSelect',
      url: './equipmentSelect.html',
      pageParam: {
          name: 'test'
      }
  });

}

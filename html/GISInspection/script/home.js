apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  $api.addCls($api.dom('.map-add'), 'aui-hide');
  $api.addCls($api.dom('.map-line'), 'aui-hide');
}

function onBack() {
  api.closeWin({});
}

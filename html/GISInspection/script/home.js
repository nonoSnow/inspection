apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  $('.map-add').addClass('aui-hide');
  $('.map-line').addClass('aui-hide');
}

function onBack() {
  api.closeWin({});
}

// 用于测试
function onOpenTaskInfo() {
  api.openWin({
      name: 'homeTaskInfo',
      url: './homeTaskInfo.html',
      pageParam: {
          name: 'test'
      }
  });

}

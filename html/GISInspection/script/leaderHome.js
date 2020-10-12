apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

}

// 绘制地图
var indexMap = new Map();
indexMap.initArea();

function onOpenUserList() {
  api.openWin({
      name: 'userList',
      url: './userList.html',
      pageParam: {
          name: 'test'
      }
  });

}

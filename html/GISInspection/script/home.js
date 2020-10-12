apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
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

// 上报
function onOpenReport() {
  api.openWin({
      name: 'addMethodReport',
      url: '../Method/addMethodReport.html',
      pageParam: {
          name: 'test'
      }
  });
}

// 人员列表
function onOpenUserList() {
  api.openWin({
      name: 'userList',
      url: './userList.html',
      pageParam: {
          name: 'test'
      }
  });

}

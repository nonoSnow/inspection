apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  console.log(JSON.stringify($api.getStorage('userLoginInformation')));
  // 获取当前用户的位置及在线信息
  getUserLoactionInfo();
}

// 绘制地图
var indexMap = new Map();
indexMap.initArea();

function onBack() {
  api.closeWin({});
}

// 获取当前用户的位置及在线信息
function getUserLoactionInfo () {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    ajaxMethod({
        url: apiUrl + 'PersonService/GetAllLocationPageList',
        data: {
            OneDay: '',
            UserName: userLoginInformation.currentUserInfo.userInfo.trueName,
            maxResultCount: 10,
            pageIndex: 1
        },
        success: function(result) {
        },
        error: function(err) {
            JSON.stringify(err)
        }
    })
}



// 用于测试
function onOpenTaskInfo() {
  // 需传参数  type-0  表示进行中任务
  api.openWin({
      name: 'homeTaskInfo',
      url: './homeTaskInfo.html',
      pageParam: {
          type: '0'
      }
  });

}

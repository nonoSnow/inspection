
var isAbnormal = true;  // 是否异常
var isLeader = true;  // 是否是领导

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  onPageInit();
}

function onPageInit() {
  if (api.pageParam.type == 'handle') {
    $('.detail').addClass("aui-hide");
    $('.abnormal').addClass("aui-hide");

    $("#fotDetail").addClass("aui-hide");
    $("#fotLeader").addClass("aui-hide");
  } else {
    if (isAbnormal) {
      $('.abnormal').removeClass("aui-hide");
    }

    if (isLeader) {
      $(".detail").removeClass("aui-hide");
    } else {
      $(".leader").addClass("aui-hide");
    }
  }
}

// 巡检记录
function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test'
      }
  });

}

// 转工单
function onTransferJob() {
  var dialog = new auiDialog({});
  dialog.alert({
      title:"弹出提示",
      buttons:['取消','确定']
  },function(ret){
      console.log(JSON.stringify(ret));
      if (ret.buttonIndex == '2') {
        api.openWin({
            name: 'addJob',
            url: '../Job/addJob.html',
            pageParam: {
                name: 'test'
            }
        });

      }
  })
}

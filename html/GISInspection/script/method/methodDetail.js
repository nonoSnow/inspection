var methodType;
var Id;
var deviceId = '';
var deviceInfo = {};

// 是否是领导
var isLeader = false;

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
  methodType = api.pageParam.type;
  Id = api.pageParam.Id;
  showDetailsData(api.pageParam.Id);

  if (getCurrentUserRoles() == 1) {
    isLeader = true;
  } else {
    isLeader = false;
  }
  // showDetailsData(id);
  // console.log(methodType);
  if (methodType == 0) {
    // 待处理事件，可以转工单或者关闭
    $(".footer").removeClass('aui-hide');
    if (isLeader) {
      $('.transforOrder').removeClass('aui-hide');
    }
  }else if(methodType == 1) {
    // 转工单事件
    $(".footer").addClass('aui-hide');
  } else if (methodType == 2) {
    //已关闭事件
    $(".footer").addClass('aui-hide');
  }
}


// 获取事件设备详情
function showDetailsData(id){
  var data = {
  Id:id
  }
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '加载中...',
      modal: false
  });
  getEventDetail("api/services/Inspection/EventService/GetEventDetails",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
      if(ret.success){
        // console.log(JSON.stringify(ret));
          deviceInfo = ret.result;
          ret.result.url = baseUrl;
          $('#detailList').html('');
          var data = ret.result;
          var str = template("methodList", data);
          $('#detailList').append(str);

          deviceId = ret.result.deviceId
      }
  }

  function showErr(err){
    // console.log(JSON.stringify(err));
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("加载失败")
    }
  }
}
// 跳转到巡检记录页面
function onOpenInspectionRecord() {
    // alert(JSON.stringify(deviceInfo))
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          devInfo: deviceInfo,
          type: 'methodDetail'
      }
  });
}

// 转工单
function onOpenTransfWorkOrder() {
  // console.log(JSON.stringify(deviceInfo));
  var userLoginInformation = $api.getStorage('userLoginInformation');
  // console.log(JSON.stringify(userLoginInformation));

  var personInfo = {
    userName: userLoginInformation.currentUserInfo.userInfo.trueName,
    userId: userLoginInformation.currentUserInfo.userInfo.userId
  }
  // console.log(JSON.stringify(personInfo));
  api.openWin({
      name: 'addJob',
      url: '../Job/addJob.html',
      pageParam: {
          deviceId: deviceId,
          eventId: Id,
          type: 'transOrder',
          personInfo: personInfo
      }
  });
}

// 关闭事件
function onOpenClose() {
    api.confirm({
        msg: '您确定要关闭该任务吗？',
        buttons: ['确定', '取消']
    }, function(ret, err){
        if( ret ){
             if(ret.buttonIndex == 1) {
                 closeEvent()
             }
        }else{
            //  alert( JSON.stringify( err ) );
        }
    });
}

// 关闭事件事件操作
function closeEvent() {
    changeEventStatus({
        data: {
            id: Id,
            status: 3
        },
        success: function(ret) {
            if(ret.success) {
                api.toast({
                    msg: '关闭成功',
                    duration: 2000,
                    location: 'middle'
                });

                setTimeout(function(){
                    api.sendEvent({
                        name: 'closeEvent',
                        extra: {
                            index: 1
                        }
                    });
                    api.closeWin();
                }, 500)
            } else {
                api.toast({
                    msg: ret.message,
                    duration: 2000,
                    location: 'middle'
                });
            }

        }
    })
}

// 查看地图
function checkMap() {
  // console.log(JSON.stringify(deviceInfo));
    api.openWin({
        name: 'devicemap',
        url: '../common/device.html',
        pageParam: {
            deviceInfo: deviceInfo
        }
     });
}

// 预览图片
function previewImg(that) {
  // if (that != null) {
    var imgSrc = $(that).attr('parse');
    var data = [];
    data.push(imgSrc);
    previewImage(data);
  // }
}

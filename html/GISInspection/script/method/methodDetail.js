var methodType;
var Id;
var deviceId = '';
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
  console.log('你已进入了设备详情页面');
  methodType = api.pageParam.type;
  console.log(api.pageParam.Id);
  Id=api.pageParam.Id;
  showDetailsData(api.pageParam.Id)

  if(methodType == 1) {
      $(".footer").removeClass('aui-hide')
  }
  // showDetailsData(id);
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
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test'
      }
  });
}

// 转工单
function onOpenTransfWorkOrder() {
    alert(deviceId + ',' + Id)
    api.openWin({
        name: 'addJob',
        url: '../Job/addJob.html',
        pageParam: {
            deviceId: deviceId,
            eventId: Id
        }
    });
}

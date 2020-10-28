var id;
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
  console.log('你已进入了设备详情页面');
  id = api.pageParam.Id;
  // console.log(id);
  showDetailsData(id);
}


// 获取事件设备详情
function showDetailsData(id){
  var data = {
    id: id
  }
  getEventDetail("api/services/Inspection/EventService/GetEventDetails",data,showRet,showErr);
  function showRet(ret){
    console.log(JSON.stringify(ret));
    $('#detailList').html('');
    var str = template("methodList", data);
    $('#detailList').append(str);
    console.log(JSON.stringify($('#detailList').html()));
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

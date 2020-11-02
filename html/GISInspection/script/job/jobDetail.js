
var jobType;
var Id;
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  jobType = api.pageParam.type;
  console.log(api.pageParam.Id);
  Id=api.pageParam.Id;
  showData(api.pageParam.Id);
}

// 渲染页面
function showPage(){
  $(".footer").removeClass('aui-hide');
  if (jobType == 0) {
    $('.turn-btn').addClass('aui-hide');
    $('.receive-btn').addClass('aui-hide');
    $('.job-receive').addClass('aui-hide');

    $('.job-status').addClass('bgc-gre');
    $('.job-status-text').html('进行中');
  } else if (jobType == 1) {
    $('.handle-btn').addClass('aui-hide');
    $('.handle-head').addClass('aui-hide');

    $('.job-status').addClass('bgc-war');
    $('.job-status-text').html('待接收');
  } else if (jobType == 2) {
    // 测试代码 工单已完成  或  已关闭  后期修改
    // var jobStatus = 1;
    // if (jobStatus == 1) {
    //   $('.job-status').addClass('bgc-5cd');
    //   $('.job-ok').removeClass('aui-hide');
    //   $('.job-status-text').html('已完成');
    // } else {
    //   $('.job-status').addClass('bgc-cc6');
    //   $('.job-status-text').html('已关闭');
    // }
    $('.job-status').addClass('bgc-5cd');
    $('.job-ok').removeClass('aui-hide');
    $('.job-status-text').html('已完成');

    $('.footer').addClass('aui-hide');
    $('.flex-con').removeClass('margin-bot250');
    $('.job-receive').addClass('aui-hide');

  }
}

// 请求接口获取工单详情
function showData(id){
  var data = {
    Id:id
  }
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '加载中...',
      modal: false
  });
  jobPostMethod("api/services/Inspection/WorkOrderService/GetWorkOrderDetails",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();

    console.log("****************************"+id);
    console.log(JSON.stringify(ret));
    if(ret.success){
      $('#detailList').html('');
      var data = ret.result;
      data = dataProcess(data);
      var str = template("jobList", data);
      $('#detailList').append(str);
      showPage();
      if(data.status==3){
        // 关闭状态会把工单反馈隐藏出来
        $('.job-ok').addClass('aui-hide');
        $('.job-status').addClass('bgc-cc6');
        $('.job-status-text').html('已关闭');
      }
    }
  }

  function showErr(err){
    api.hideProgress();

    // console.log(JSON.stringify(err));
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("加载失败")
    }
  }
}

function onOpenCloseTurn(type) {
  console.log(type);
  if(type=='1'){
    api.openWin({
        name: 'jobClose',
        url: './jobClose.html',
        pageParam: {
            Id:Id,
            jobType:1
        }
    });
  }else if(type=='2'){
    api.openWin({
        name: 'jobCloseTurn',
        url: './jobCloseTurn.html',
        pageParam: {
            Id: Id,
        }
    });
  }
}

// 查看转派原因
function onOpenTurnRes(el){
  console.log($(el).attr('param'));
  api.openWin({
      name: 'jobTurnRes',
      url: './jobTurnRes.html',
      pageParam: {
          Id: $(el).attr('param'),
      }
  });
}

function onOpenHandle() {
  api.openWin({
      name: 'jobHandle',
      url: './jobHandle.html',
      pageParam: {
          name: 'test'
      }
  });

}
// 对数据进行处理 对于已完成的工单的工单反馈表进行处理，以及时间进行处理
function dataProcess(obj){
  // 工单反馈表
  if(obj.workOrderBacks.length>0){

  }
  // 时间处理
  obj.planCompleteTime=obj.planCompleteTime?obj.planCompleteTime.replace("T"," "):obj.planCompleteTime;
  obj.creationTime=obj.creationTime?obj.creationTime.replace("T"," "):obj.creationTime;
  obj.completeTime=obj.completeTime?obj.completeTime.replace("T"," "):obj.completeTime;
  if(obj.eventDetails){
    obj.eventDetails.creationTime=obj.eventDetails.creationTime?obj.eventDetails.creationTime.replace("T"," "):obj.eventDetails.creationTime;
  }
  // 为图片添加url 前缀
  obj.url = baseUrl;
  return obj
}

// 点击接收
function onReceived(){
  var data = {
    Id:parseInt(Id), //工单ID
    status:2
  }
  // 提示 会回到工单页面
  var dialog = new auiDialog({});
  dialog.alert({
      title:"接收后将会跳转到工单页面",
      buttons:['取消','确定']
  },function(ret){
      console.log(JSON.stringify(ret));
      if (ret.buttonIndex == '2') {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '接收中...',
            modal: false
        });
        jobPostMethod("api/services/Inspection/WorkOrderService/ReceiveWorkOrder",data,showRet,showErr);
      }
  })

  function showRet(ret){
    api.hideProgress();
    if(ret.success){
      // console.log(JSON.stringify(data));
      api.toast({
          msg: '接收成功',
          duration: 2000,
          location: 'bottom'
      });
      // initReceived()
      // 广播事件，接收
      api.sendEvent({
          name: 'initJob',
          extra: {
              funcName: 1,
          }
      });
      onBack();
    }
  }

  function showErr(err){
    api.hideProgress();

    // console.log(JSON.stringify(err));
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("接收失败")
    }
  }
}


var jobType = 0;
var headName;
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  initOngoing();
  // 获取负责人
  var userLoginInformation = $api.getStorage('userLoginInformation');
  // console.log(JSON.stringify(userLoginInformation));
  headName=userLoginInformation.currentUserInfo.userInfo.orgName;
  onMenu(jobType)
  // 监听事件 刷新页面
  api.addEventListener({
      name: 'initJob'
  }, function(ret, err){
      if( ret ){
          //  alert( JSON.stringify( ret ) );
           onMenu(parseInt(ret.value.funcName))
      }else{
           alert( JSON.stringify( err ) );
      }
  });

}

// 获取待接收、进行中、已完成的工单 接口调用
function showData(data,status){
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '加载中...',
      modal: false
  });
  jobPostMethod("api/services/Inspection/WorkOrderService/GetWorkOrderListApp",data,showRet,showErr);
  // console.log(JSON.stringify($api.getStorage('loginData')));
  function showRet(ret){
    api.hideProgress();

    // console.log("--------------------------"+status);
    // console.log(JSON.stringify(ret));
    if(ret.success){
      $('#dataList').html('');
      var data = transT(ret.result.items);
      // console.log(JSON.stringify(data));
      if(data.length){
        var list = {list:data};
        var str = template(status, list);
        $('#dataList').append(str);
      }else{
        var str="<div style='text-align:center;margin:20px;'>暂无数据</div>"
        $('#dataList').append(str);
      }
    }
  }

  function showErr(err){
    api.hideProgress();

    // console.log(JSON.stringify(err));
    if(err.body){
      if(err.body.error){
        if(err.body.error.message){
          alert(err.body.error.message)
        }else {
          alert("加载失败")
        }
      }else {
        alert("加载失败")
      }
    }else {
      alert("加载失败");
    }
  }
}
// 初始化进行中的工单列表
function initOngoing(){
  var data = {
    status:2,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'onGoing');
}
// 待接收的工单
function initReceived(){
  var data = {
    status:1,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'received');

}

// 已完成的工单
function initCompleted(){
  var data = {
    status:4,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'completed');
}

function onMenu(index, el) {
  jobType = index;
  if (index == 0) {
    // 工单进行中
    initOngoing()
  } else if (index == 1) {
    // 工单待接收
    initReceived()
  } else if (index == 2) {
    // 工单已完成
    initCompleted()
  }
  onCheckMenu(el, function(){
    // console.log(123);
  });
}

// 任务详情
function onOpenJobDetail(el) {
  // console.log($(el).attr('param'));
  api.openWin({
      name: 'jobDetail',
      url: './jobDetail.html',
      pageParam: {
          type: jobType,
          Id: $(el).attr('param')
      }
  });

}

// 待接收工单点击接收
function onReceived(el){
  var Id=$(el).attr('param'); //工单ID
  var data = {
    Id:parseInt(Id),
    status:2
  }
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '接收中...',
      modal: false
  });
  jobPostMethod("api/services/Inspection/WorkOrderService/ReceiveWorkOrder",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    if(ret.success){
      // console.log(JSON.stringify(data));
      api.toast({
          msg: '接收成功',
          duration: 2000,
          location: 'bottom'
      });
      initReceived()
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

// 关闭工单
function onCloseJob(el){
  var Id=$(el).attr('param'); //工单ID
  // console.log(Id);
  // 跳转到关闭工单页面
  api.openWin({
      name: 'jobClose',
      url: './jobClose.html',
      pageParam: {
          Id:Id,
          jobType:jobType
      }
  });
}

// 接口时间返回来的T 转换为空格 并把负责人加进去
function transT(data){
  for (var i = 0; i < data.length; i++) {
    data[i].planCompleteTime=data[i].planCompleteTime.replace("T"," ");
    data[i].creationTime=data[i].creationTime.replace("T"," ");
    data[i].completeTime=data[i].completeTime==""||data[i].completeTime==null?data[i].completeTime:data[i].completeTime.replace("T"," ");
    // console.log(data[i].completeTime);

    data[i].headName = headName;
  }
  return data
}

// 填写工单
function onWrite(el){
  var Id=$(el).attr('param'); //工单ID
  // console.log(Id);
  // 跳转到关闭工单页面
  api.openWin({
      name: 'jobHandle',
      url: './jobHandle.html',
      pageParam: {
          Id:Id
      }
  });
}

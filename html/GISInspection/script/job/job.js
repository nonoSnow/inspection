
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
  // onMenu(jobType)
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

  // 监听下拉刷新，上拉加载
  refreshData()
}

// 获取待接收、进行中、已完成的工单 接口调用
function showData(data,status){
  $('#dataList').html('');
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
      // $('#dataList').html('');
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

// 工单详情
function onOpenJobDetail(el) {
  var param = JSON.parse($(el).attr('param'));
  // console.log(JSON.stringify(param));
  api.openWin({
      name: 'jobDetail',
      url: './jobDetail.html',
      pageParam: {
          type: jobType,  //状态（1：待接收；0：进行中；2：已完成）
          Id: param.id,   //工单ID
          type7:param.type  //工单类型（1：查漏；2：查漏延伸；3：维修管道；4：维修管道延伸；5：违章罚款；6：贫水区改造）
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
  var param=JSON.parse($(el).attr('param')); //工单
  console.log(JSON.stringify(param));
  // 工单类型（1：查漏；2：查漏延伸；3：维修管道；4：维修管道延伸；5：违章罚款；6：贫水区改造）
  if(param.type==1 || param.type==2){
    // 1：查漏；2：查漏延伸；
    // 跳转到关闭工单页面
    api.openWin({
        name: 'jobHandleLeak',
        url: './jobHandleLeak.html',
        pageParam: {
            Id:param.id,
            from:"job"
        }
    });
  }else if (param.type==5) {
    // 5：违章罚款；
    api.openWin({
        name: 'jobHandlePenalty',
        url: './jobHandlePenalty.html',
        pageParam: {
            Id:param.id,
            from:"job"
        }
    });
  }else{
    // 3：维修管道；4：维修管道延伸；6：贫水区改造
    api.openWin({
        name: 'jobHandleRepair',
        url: './jobHandleRepair.html',
        pageParam: {
            Id:param.id,
            from:"job"
        }
    });
  }
}

// 下拉刷新 上拉加载
function refreshData(){
  // 下拉刷新
  // api.setRefreshHeaderInfo({
  //     visible: true,
  //     bgColor: '#F0F0F0',
  //     textColor: '#999999',
  //     textDown: '下拉刷新...',
  //     textUp: '松开刷新...',
  //     showTime: true
  // }, function(ret, err) {
  //     setTimeout(function() {
  //       console.log(jobType);
  //         api.refreshHeaderLoadDone();
  //         onMenu(jobType)
  //     }, 500);
  // });

  // 上拉加载
  // api.addEventListener({
  //   name:'scrolltobottom',
  //   extra:{
  //       threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
  //   }
  // }, function(ret, err){
  //     alert('已滚动到底部');
  // });
}

// 请求口径接口，并广播
function getCaliberList(){
  // jobPostMethod()
  function showRet(ret){
    if(ret.success){

    }
  }

  function showErr(err){
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

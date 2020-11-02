
var jobType = 0;
var headName;

//进行中的总条数、当前页
var onGoingPageAll=0;
var onGoingPageNum=1;
//待接收的总条数、当前页
var onReceivedPageAll=0;
var onReceivedPageNum=1;
//已完成的总条数、当前页
var onCompletedPageAll=0;
var onCompletedPageNum=1;

// 设置页数
var pageCount=5

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
  refreshData();
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

    console.log("--------------------------"+status);
    console.log(JSON.stringify(ret));
    if(ret.success){
      // $('#dataList').html('');
      var data = transT(ret.result.items);
      // console.log(JSON.stringify(data));
      if(data.length){
        if(status=="onGoing"){
          //进行中的总条数、当前页
          onGoingPageAll=ret.result.totalCount;
          onGoingPageNum=ret.result.pageIndex;
        }else if(status=="received"){
          //待接收的总条数、当前页
          onReceivedPageAll=ret.result.totalCount;
          onReceivedPageNum=ret.result.pageIndex;
        }else if (status=="completed") {
          //已完成的总条数、当前页
          onCompletedPageAll=ret.result.totalCount;
          onCompletedPageNum=ret.result.pageIndex;
        }
        var list = {list:data};
        var str = template(status, list);
        $('#dataList').append(str);
      }else{
        var str="<img src='../../image/nothing.png'><div style='text-align:center;margin:20px;color:#aaa;'>暂无数据</div>"
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
    MaxResultCount:pageCount
  }
  showData(data,'onGoing');
}
// 待接收的工单
function initReceived(){
  var data = {
    status:1,
    pageIndex:1,
    MaxResultCount:pageCount
  }
  showData(data,'received');

}

// 已完成的工单
function initCompleted(){
  var data = {
    status:4,
    pageIndex:1,
    MaxResultCount:pageCount
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
  // 上拉加载
  // 监听滚动
  $('#dataBox').scroll(function() {
    var h = $(this).height(); // 可视化高度(681)
    var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
    var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

    // console.log(h);
    // console.log(Math.ceil(st));
    if(Math.ceil(st)==0){
      //页面点击menu
      return false;
    }
    // console.log(sh);
    // console.log(JSON.stringify($(this)[0]));
    if (h + Math.ceil(st)+1 >= sh) {
      // 进行中
      if(jobType==0){
        // 如果总条数<当前页条数*页数 就是没有数据
        if(onGoingPageAll<pageCount*onGoingPageNum){
          api.toast({
               msg: '没有更多数据了~',
               duration: 2000,
               location: 'middle'
           });
           return false
        }
        // 有下一页
        onGoingPageNum++;
        var data = {
          status:2,
          pageIndex:onGoingPageNum,
          MaxResultCount:pageCount
        };
        addData(data,"onGoing")
      }else if(jobType==1){
        console.log(onReceivedPageAll);
        console.log(pageCount*onReceivedPageNum);
        // 如果总条数<当前页条数*页数 就是没有数据
        if(onReceivedPageAll<pageCount*onReceivedPageNum){
          api.toast({
               msg: '没有更多数据了~',
               duration: 2000,
               location: 'middle'
           });
           return false
        }
        // 有下一页
        onReceivedPageNum++;
        var data = {
          status:1,
          pageIndex:onReceivedPageNum,
          MaxResultCount:pageCount
        };
        addData(data,"received")
      }else if(jobType==2){
        // 如果总条数<当前页条数*页数 就是没有数据
        console.log(onCompletedPageAll);
        console.log(pageCount*onCompletedPageNum);
        if(onCompletedPageAll<pageCount*onCompletedPageNum){
          api.toast({
               msg: '没有更多数据了~',
               duration: 2000,
               location: 'middle'
           });
           return false
        }
        // 有下一页
        onCompletedPageNum++;
        var data = {
          status:4,
          pageIndex:onCompletedPageNum,
          MaxResultCount:pageCount
        };
        addData(data,"completed")
      }
    }
  })
}

// 获取待接收、进行中、已完成的工单 接口调用 数据增加
function addData(data,status){
  // $('#dataList').html('');
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

    console.log("--------------------------"+status);
    console.log(JSON.stringify(ret));
    if(ret.success){
      // $('#dataList').html('');
      var data = transT(ret.result.items);
      // console.log(JSON.stringify(data));
      if(data.length){
        var list = {list:data};
        var str = template(status, list);
        $('#dataList').append(str);
      }else{
        api.toast({
             msg: '没有更多数据了~',
             duration: 2000,
             location: 'middle'
         });
        // var str="<div style='text-align:center;margin:20px;'>暂无数据</div>"
        // $('#dataList').append(str);
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

// 新增工单
function addJob(){
  api.openWin({
      name: 'addJob',
      url: './addJob.html',
      pageParam:{
        eventId:""
      }
  });
}

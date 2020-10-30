
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
  var type=parseInt(api.pageParam.type7);    //工单类型 7种
  console.log(type);
  // 工单类型（1：查漏；2：查漏延伸；3：维修管道；4：维修管道延伸；5：违章罚款；6：贫水区改造）
  if(type==1 || type==2){
    // 1：查漏；2：查漏延伸；
    // 跳转到关闭工单页面
    api.openWin({
        name: 'jobHandleLeak',
        url: './jobHandleLeak.html',
        pageParam: {
            Id:Id,
            from:"jobDetail"
        }
    });
  }else if (type==5) {
    // 5：违章罚款；
    api.openWin({
        name: 'jobHandlePenalty',
        url: './jobHandlePenalty.html',
        pageParam: {
            Id:Id,
            from:"jobDetail"
        }
    });
  }else{
    // 3：维修管道；4：维修管道延伸；6：贫水区改造
    api.openWin({
        name: 'jobHandleRepair',
        url: './jobHandleRepair.html',
        pageParam: {
            Id:Id,
            from:"jobDetail"
        }
    });
  }
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

  // 对工单反馈的数据进行处理
  var workArr=[];
  if(obj.predictWaterLoss){
    var str="预估漏损："+obj.predictWaterLoss+"m³";
    workArr.push(str);
  }

  addWork("查漏",obj.workOrderBacks.leak);
  addWork("查漏延伸",obj.workOrderBacks.leakExtension);
  addWork("维修",obj.workOrderBacks.repair);
  addWork("改管",obj.workOrderBacks.change);
  addWork("阀门",obj.workOrderBacks.valve);
  addWork("消防栓",obj.workOrderBacks.fireHydrant);
  addWork("违章单位",obj.workOrderBacks.company);
  if(obj.type==3 || obj.type==4 || obj.type==6){
    addWork("改造地点",obj.workOrderBacks.address);
  }else if(obj.type==1 || obj.type==1){
    addWork("查漏地点",obj.workOrderBacks.address);
  }

  function addWork(name,workObj){
    if(workObj.length>0){
      var str=name+"：";
      for (var i = 0; i < workObj.length; i++) {
        workObj[i].caliber = workObj[i].caliber==null?"":workObj[i].caliber+"，";
        workObj[i].value = workObj[i].value==null?"":workObj[i].value;
        if(i==workObj.length-1){
          str=str+workObj[i].caliber+workObj[i].value
        }else{
          str=str+workObj[i].caliber+workObj[i].value+"；"
        }
      }
      workArr.push(str);
    }
  }

  if(obj.violationAddress){
    var str="违章地点："+obj.violationAddress;
    workArr.push(str);
  }
  if(obj.caliber){
    var str="管径/口径："+obj.caliber;
    workArr.push(str);
  }
  if(obj.time){
    var str="日期："+obj.time.replace("T00:00:00"," ");
    workArr.push(str);
  }

  if(obj.projectCost){
    var str="工程费："+obj.projectCost+"元";
    workArr.push(str);
  }
  if(obj.waterCost){
    var str="水费："+obj.waterCost+"元";
    workArr.push(str);
  }
  if(obj.violationReason){
    var str="原因："+obj.violationReason;
    workArr.push(str);
  }
  if(obj.remark){
    var str="备注："+obj.remark;
    workArr.push(str);
  }
  console.log(JSON.stringify(workArr));
  obj.workArr=workArr;
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

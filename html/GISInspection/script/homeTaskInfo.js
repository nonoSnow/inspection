
var nowTaskType;
var taskId = 0;
// 任务详情
var taskDetail;
// 待巡总数（点击完成时提示需要）
var daixunTotal;

var daixunPageIndex = 1;
var daixunHasNext = false;
var daixunData = [];

var yixunPageIndex = 1;
var yixunHasNext = false;
var yixunData = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  nowTaskType = api.pageParam.type;
  taskId = api.pageParam.id;
  console.log(api.pageParam.id);
  console.log(taskId);
  if (nowTaskType == '0') {
    $('.task-stop').html('暂停');
    $('.task-complete').html('完成');
  } else if (nowTaskType == '1') {
    $('.task-stop').html('关闭');
    $('.task-complete').html('启动');
  } else if (nowTaskType == '2') {
    $('.task-stop').html('关闭');
    $('.task-complete').html('重启');
  } else if (nowTaskType == '3') {
    $('.footer').addClass('aui-hide');
    $('.flex-con').removeClass('margin-bot250');
  }

  onMenu(0, '');

  // 监听上拉
  $('#list-box').scroll(function() {
    var h = $(this).height(); // 可视化高度(681)
    var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
    var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

    // console.log(h + Math.ceil(st) >= sh);

    if (h + Math.ceil(st) >= sh) {
      switch (taskTypeIndex) {
        case 0:
          console.log('基础信息，不操作');
          break;
        case 1:
          console.log('这是待巡点列表');
          if (daixunHasNext) {
            // 如果有下一页，则页码++
            daixunPageIndex++;
            initToBeInspected();
          } else {
            // 提示没有更多数据了
            api.toast({
                msg: '没有更多数据了~',
                duration: 2000,
                location: 'middle'
            });
          }
          break;
        case 2:
          console.log('这是已巡点列表');
          if (yixunHasNext) {
            // 如果有下一页，则页码++
            yixunPageIndex++;
            initInspected();
          } else {
            // 提示没有更多数据了
            api.toast({
                msg: '没有更多数据了~',
                duration: 2000,
                location: 'middle'
            });
          }
          break;
      }
    }
  })
}

function onMenu(index, el) {
  if (index == 0) {
    // $(".task-info").removeClass('aui-hide');
    $(".footer").removeClass('aui-hide');

    // $(".task-list").addClass('aui-hide');
    // $(".flex-con").addClass('margin-bot250');
    initTaskDetail();
  } else if(index == 1 || index == 2) {
    // $(".task-info").addClass('aui-hide');
    $(".footer").addClass('aui-hide');

    // $(".task-list").removeClass('aui-hide');
    // $(".flex-con").removeClass('margin-bot250');

    if (index == 1) {
      // $('.item-btn').addClass('aui-hide');
      // $('.inspector').addClass('aui-hide');
      // $('.completion-time').addClass('aui-hide');
      daixunPageIndex = 1;
      daixunData = [];
      initToBeInspected();
    } else {
      // $('.item-btn').removeClass('aui-hide');
      // $('.inspector').removeClass('aui-hide');
      // $('.completion-time').removeClass('aui-hide');
      yixunPageIndex = 1;
      yixunData = [];
      initInspected();
    }
  }
  if (el == '') {
    return;
  }
  onCheckMenu(el, function(){
    console.log(123);
  });
}

// 点击待巡检
function onOpenEquipment(that) {
  if (that != null) {
    var data = JSON.parse($(that).attr("parse"));
    console.log(JSON.stringify(data));
    // var param = {
    //   deviceId: data.Id,
    //   taskId: taskId,
    //   status: data.status,
    //   inspectionStatus: data.InspectionStatus,
    //   inspectionStatusStr: data.inspectionStatusStr,
    //   address: data.address
    // }
    // console.log(JSON.stringify(param));
    api.openWin({
        name: 'equipmentMapInfo',
        url: './equipmentMapInfo.html',
        pageParam: {
            name: 'test',
            data: data,
            taskId: taskId
        }
    });
  }
}


function onOpenTaskDetail(that) {
  var data = $(that).attr('parse');
  data = JSON.parse(data);
  console.log(typeof(data));
  // console.log(JSON.stringify(data)):
  api.openWin({
      name: 'taskInfoSubmit',
      url: './taskInfoSubmit.html',
      pageParam: {
          type: 'detail',
          data: data
      }
  });

}

// 点击第一个按钮
function clickFirst(){
  if (nowTaskType == '0') {
    // 进行中任务
    // 点击了暂停
    onOpenTaskStop();
  } else if (nowTaskType == '1') {
    // 待启动任务
    // 点击了关闭
    closeTask();

  } else if (nowTaskType == '2') {
    // 已暂停任务
    // 点击了关闭
    closeTask();
  }
}

// 点击第二个按钮
function clickSecond() {
  if (nowTaskType == '0') {
    // 进行中任务
    // 点击了完成
    console.log('点击了完成');
    complete();
  } else if (nowTaskType == '1') {
    // 待启动任务
    // 点击了启动
    startTask();

  } else if (nowTaskType == '2') {
    // 已暂停任务
    // 点击了重启
    reStartTask();
  }
}

// 启动（接收）
function startTask() {
  var data = {
    id: taskId,
    operate: 3
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);

  function showRet(ret) {
    // 修改状态成功，关闭成功
    openTask();
  }

  function showErr(err) {
    if(err.body.error != undefined){
      // alert(err.body.error.message);
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      // alert(err.msg);
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }
}

// 关闭
function closeTask() {
  var message = '您确定要关闭' + taskDetail.name + '吗？'
  api.confirm({
      msg: message,
      buttons: ['确定', '取消']
  }, function(ret, err) {
      if (ret.buttonIndex == 1) {
        //点击确定，关闭任务
        var param = {
          id: taskId,
          operate: 4
        }

        changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);

        function showRet(ret) {
          // 修改状态成功，关闭成功
          openTask();
        }

        function showErr(err) {
          if(err.body.error != undefined){
            // alert(err.body.error.message);
            api.toast({
                msg: err.body.error.message,
                duration: 2000,
                location: 'middle'
            });

          }else{
            // alert(err.msg);
            api.toast({
                msg: err.msg,
                duration: 2000,
                location: 'middle'
            });
          }
        }
      }
  });
}

// 重启
function reStartTask() {
  var data = {
    id: taskId,
    operate: 5
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);

  function showRet(ret) {
    openTask();
  }

  function showErr(err) {
    if(err.body.error != undefined){
      // alert(err.body.error.message);
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      // alert(err.msg);
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }
}

// 完成
function complete() {
  // initToBeInspected();
  var data = {
    taskId: taskId,
    status: 1,
    PageIndex: 1,
    MaxResultCount: 10
  }
  getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",data,showRet,showErr);

  function showRet(ret) {
    daixunTotal = ret.result.totalCount;
    var message = '该任务中有' + daiXunTotal + '个待巡点未完成！您确定要完成该任务吗？'
    api.confirm({
        msg: message,
        buttons: ['确定', '取消']
    }, function(ret, err) {
        if (ret.buttonIndex == 1) {
          //点击确定，完成任务
          var param = {
            id: taskId,
            operate: 2
          }

          changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);

          function showRet(ret) {
            // 修改状态成功，完成成功
            initOngoing();
          }

          function showErr(err) {
            if(err.body.error != undefined){
              // alert(err.body.error.message);
              api.toast({
                  msg: err.body.error.message,
                  duration: 2000,
                  location: 'middle'
              });

            }else{
              // alert(err.msg);
              api.toast({
                  msg: err.msg,
                  duration: 2000,
                  location: 'middle'
              });
            }
          }
        }
    });
  }

  function showErr(err) {

  }
  var data = {
    id: taskId,
    operate: 2
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);

  function showRet(ret) {
    openTask();
  }

  function showErr(err) {
    if(err.body.error != undefined){
      // alert(err.body.error.message);
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      // alert(err.msg);
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }
}

// 打开暂停页面
function onOpenTaskStop() {
  // console.log(JSON.stringify(taskDetail));
  api.openWin({
      name: 'taskStop',
      url: './taskStop.html',
      pageParam: {
          name: 'test',
          data: taskDetail
      }
  });

}
// 初始化基础信息
function initTaskDetail() {
  var data = {
    id: taskId
  }
  console.log('进入初始化基础信息了');
  getTaskDetail(data);
}

// 初始化待巡点列表
function initToBeInspected() {
  var data = {
    taskId: taskId,
    status: 1,
    PageIndex: daixunPageIndex,
    MaxResultCount: 10
  }

  getInspecteList(data, 'toBeInspected');
}

// 初始化已巡点列表
function initInspected() {
  var data = {
    taskId: taskId,
    status: 2,
    PageIndex: yixunPageIndex,
    MaxResultCount: 10
  }
  getInspecteList(data, 'inspected');
}

// 获取任务详情基础信息
function getTaskDetail(param) {
  // console.log('进入请求基础信息了');
  $('#taskDetail').html('');
  taskDetail = {
    id: 1,
    name: '测试任务',
    type: 1,
    typeStr: '临时任务',
    status: 1,
    statusStr: '进行中',
    person: '张三',
    planStartTime: '',
    areaId: 1,
    areaName: '片区1',
    planEndTime: '',
    participant: '李四、王五',
    startTime: '',
    endTime: '',
    closeReason: '',
    stopReason: '',
    remark: '备注内容',
    pauseTime: '',
    orgId: ''
  }
  var str = template('taskBasicInfo', taskDetail);
  // console.log(JSON.stringify(str));
  // console.log(JSON.stringify($('#taskDetail').html()));
  $('#taskDetail').append(str);
  // console.log(JSON.stringify($('#taskDetail').html()));

  // getTaskBasicInfo("api/services/Inspection/InspectionTaskService/GetTaskDetails",param,showRet,showErr);

  // function showRet(ret) {
  //   $('#taskDetail').html('');
  //   var data = {
  //     Id: 1,
  //     name: '测试任务',
  //     type: 1,
  //     typeStr: '临时任务',
  //     status: 1,
  //     statusStr: '进行中',
  //     person: '张三',
  //     planStartTime: '',
  //     areaId: 1,
  //     areaName: '片区1',
  //     planEndTime: '',
  //     participant: '李四、王五',
  //     startTime: '',
  //     endTime: '',
  //     closeReason: '',
  //     stopReason: '',
  //     remark: '备注内容',
  //     pauseTime: '',
  //     orgId: ''
  //   }
  //   var str = template('taskBasicInfo', data);
  //   $('#taskDetail').append(str);
  // }
  //
  // function showErr(err) {
      // if(err.body.error != undefined){
      //   // alert(err.body.error.message);
      //   api.toast({
      //       msg: err.body.error.message,
      //       duration: 2000,
      //       location: 'middle'
      //   });
      //
      // }else{
      //   // alert(err.msg);
      //   api.toast({
      //       msg: err.msg,
      //       duration: 2000,
      //       location: 'middle'
      //   });
      // }
  // }
}

// 获取巡检点列表
function getInspecteList(param, status) {
  $('#taskDetail').html('');
  var data = {
    list: [
      {
        id: 1,
        name: '蝶阀',
        code: 'code 19886674503',
        address: '渝中区上清寺9号',
        status: 2
      },
      {
        id: 2,
        name: '阀门',
        code: 'code 19886674503',
        address: '渝中区上清寺9号',
        status: 3
      }
    ]
  }
  console.log(status);
  var str = template(status, data);
  // console.log(JSON.stringify(str));
  $('#taskDetail').append(str);
  // console.log(JSON.stringify($('#taskDetail').html()));

  api.showProgress({
    title: '加载中...',
    text: '请稍后',
  });
  getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",param,showRet,showErr);

  function showRet(ret) {
      // $('#taskDetail').html('');
      var str;
      switch (status) {
        case 'toBeInspected':
          // 待巡
          daixunHasNext = ret.result.hasNextPage;
          if (ret.result.items.length != 0) {
            for (var i = 0; i < ret.result.items.length; i++) {
              daixunData.push(ret.result.items[i]);
            }
          }
          str = template(status, daixunData);
          break;
        case 'inspected':
          // 已巡
          yixunHasNext = ret.result.hasNextPage;
          if (ret.result.items.length != 0) {
            for (var i = 0; i < ret.result.items.length; i++) {
              yixunData.push(ret.result.items[i]);
            }
          }
          str = template(status, yixunData);
          break;
      }

      api.hideProgress();

      var data = {
        list: [
          {
            Id: 1,
            name: '蝶阀',
            code: 'code 19886674503',
            address: '渝中区上清寺9号'
          },
          {
            Id: 2,
            name: '阀门',
            code: 'code 19886674503',
            address: '渝中区上清寺9号'
          }
        ]
      }

      var str = template(status, data);
      $('#taskDetail').append(str);
  }

  function showErr(err) {
    api.hideProgress();
      if(err.body.error != undefined){
        // alert(err.body.error.message);
        api.toast({
            msg: err.body.error.message,
            duration: 2000,
            location: 'middle'
        });

      }else{
        // alert(err.msg);
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'middle'
        });
      }
  }
}

function openTask() {
  api.openWin({
      name: 'Task',
      url: '../task/task.html'
  });
}

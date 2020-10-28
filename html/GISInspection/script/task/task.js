var taskTypeIndex = 0;
var daiXunTotal = 0;

// 是否是领导
var isLeader = true;

// 进行中
var goingPageIndex = 1;
var goingTotal = 0;
var goingHasNext = false;
var goingData = [];

// 待启动（待接收）
var receivePageIndex = 1;
var receiveTotal = 0;
var receiveHasNext = false;
var receiveData = [];

// 已暂停
var suspendPageIndex = 1;
var suspendTotal = 0;
var suspendHasNext = false;
var suspendData = [];

// 已完成
var completedPageIndex = 1;
var completedTotal = 0;
var completedHasNext = false;
var completeData = [];

apiready = function() {
  var header = $api.byId('header');
  // console.log(JSON.stringify(header));
  $api.fixStatusBar(header);

  var headerH = $api.offset(header).h;
  // console.log(headerH);

  var mainBox = $api.byId('flex-box');
  var mainBoxH = $api.offset(mainBox).h;

  var tabBox = $api.byId('flex-vertical');
  var tabBoxH = $api.offset(tabBox).h;

  var footer = $api.byId('footer');
  var footerH = $api.offset(footer).h;
  console.log(footerH);
  // $("#list-box").css("height", );


  if (isLeader) {
    $('#footer').removeClass('aui-hide');
    $("#taskList").css("margin-bottom", footerH + 10);
  } else {
    $('#footer').addClass('aui-hide');
    $("#taskList").css("margin-bottom", 0);
  }

  $('#list-box').scroll(function() {
    var h = $(this).height(); // 可视化高度(681)
    var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
    var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

    // console.log(h + Math.ceil(st) >= sh);

    if (h + Math.ceil(st) >= sh) {
      switch (taskTypeIndex) {
        case 0:
          console.log('这是进行中的任务');
          if (goingHasNext) {
            // 如果有下一页，则页码++
            goingPageIndex++;
            initOngoing();
          }
          break;
        case 1:
          console.log('这是待启动的任务');
          if (receiveHasNext) {
            // 如果有下一页，则页码++
            receivePageIndex++;
            initReceived();
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
          console.log('这是已暂停的任务');
          if (suspendHasNext) {
            // 如果有下一页，则页码++
            suspendPageIndex++;
            initSuspended();
          } else {
            // 提示没有更多数据了
            api.toast({
                msg: '没有更多数据了~',
                duration: 2000,
                location: 'middle'
            });
          }
          break;
        case 3:
          console.log('这是已完成的任务');
          if (completedHasNext) {
            // 如果有下一页，则页码++
            completedPageIndex++;
            initCompleted();
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

  // alert(mainBoxH);
  // alert(tabBoxH)


  // $('#list-box').css('height', (mainBoxH - headerH - tabBoxH));
  initOngoing();

}

// 初始化进行中的任务列表
function initOngoing(){
  var data = {
    status: 2,
    pageIndex: goingPageIndex,
    MaxResultCount: 10
  }
  showData(data,'onGoing');
}

// 初始化待接收的任务列表
function initReceived(){
  var data = {
    status: 1,
    pageIndex: receivePageIndex,
    MaxResultCount: 10
  }
  // console.log(JSON.stringify(data));
  showData(data,'received');
}

// 初始化已暂停的任务列表
function initSuspended(){
  var data = {
    status: 3,
    pageIndex: suspendPageIndex,
    MaxResultCount: 10
  }
  showData(data,'suspended');
}

// 初始化已完成的任务列表
function initCompleted(){
  var data = {
    status: 4,
    pageIndex: completedPageIndex,
    MaxResultCount: 10
  }
  showData(data,'completed');
}

function showData(data, status) {
  console.log(JSON.stringify(data));
  console.log(data);
  api.showProgress({
    title: '加载中...',
    text: '请稍后',
  });
  $('#taskList').html('');
  getTaskDataSingle("api/services/Inspection/InspectionTaskService/AppGetTaskList",data,showRet,showErr);

  function showRet(ret) {
    console.log('1111111111111111111111111111111111111');
    console.log(JSON.stringify(ret));
    // $('#taskList').html('');
    // console.log(JSON.stringify($('#taskList').html()));

    var str;
    switch (status) {
      case 'onGoing':
        goingHasNext = ret.result.hasNextPage;
        if (ret.result.items.length != 0) {
          for (var i = 0; i < ret.result.items.length; i++) {
            goingData.push(ret.result.items[i]);
          }
        }
        str = template(status, goingData);
        break;
      case 'received':
        receiveHasNext = ret.result.hasNextPage;
        if (ret.result.items.length != 0) {
          for (var i = 0; i < ret.result.items.length; i++) {
            receiveData.push(ret.result.items[i]);
          }
        }
        str = template(status, receiveData);
        break;
      case 'suspended':
        suspendHasNext = ret.result.hasNextPage;
        if (ret.result.items.length != 0) {
          for (var i = 0; i < ret.result.items.length; i++) {
            suspendData.push(ret.result.items[i]);
          }
        }
        str = template(status, suspendData);
        break;
      case 'completed':
        completedHasNext = ret.result.hasNextPage;
        if (ret.result.items.length != 0) {
          for (var i = 0; i < ret.result.items.length; i++) {
            completeData.push(ret.result.items[i]);
          }
        }
        str = template(status, completeData);
        break;
    }

    $('#taskList').append(str);

    api.hideProgress();

    var data = {
      list: [
        {
          id: "1",
          name: '测试任务1',
          type: 1,
          typeStr: '临时任务',
          endTime: null,
          orgId: null,
          status: 2,
          statusStr: '进行中',
          planTime: '',
          planEndTime: '2020-09-23 19:00',
          endTime: '2020-09-23 18:00',
          stopTime: '2020-09-21 14:00',
          startTime: '2020-09-20 9:00',
          OverdueTime: null,
          SuspendTime: '',
          finishTime: '320h'
        },
        {
          id: "2",
          name: '测试任务2',
          type: 2,
          typeStr: '计划任务',
          endTime: null,
          orgId: null,
          status: 2,
          statusStr: '进行中',
          planTime: '',
          planEndTime: '2020-09-28 19:00',
          endTime: '2020-09-27 18:00',
          stopTime: '2020-09-26 14:00',
          startTime: '2020-09-25 9:00',
          OverdueTime: '',
          SuspendTime: '',
          finishTime: '320h'
        },
        {
          id: "3",
          name: '测试任务3',
          type: 2,
          typeStr: '计划任务',
          endTime: null,
          orgId: null,
          status: 2,
          statusStr: '进行中',
          planTime: '',
          planEndTime: '2020-09-28 19:00',
          endTime: '2020-09-27 18:00',
          stopTime: '2020-09-26 14:00',
          startTime: '2020-09-25 9:00',
          OverdueTime: '',
          SuspendTime: '',
          finishTime: '320h'
        },
        {
          id: "4",
          name: '测试任务4',
          type: 2,
          typeStr: '计划任务',
          endTime: null,
          orgId: null,
          status: 2,
          statusStr: '进行中',
          planTime: '',
          planEndTime: '2020-09-28 19:00',
          endTime: '2020-09-27 18:00',
          stopTime: '2020-09-26 14:00',
          startTime: '2020-09-25 9:00',
          OverdueTime: '',
          SuspendTime: '',
          finishTime: '320h'
        },
        {
          id: "5",
          name: '测试任务5',
          type: 2,
          typeStr: '计划任务',
          endTime: null,
          orgId: null,
          status: 2,
          statusStr: '进行中',
          planTime: '',
          planEndTime: '2020-09-28 19:00',
          endTime: '2020-09-27 18:00',
          stopTime: '2020-09-26 14:00',
          startTime: '2020-09-25 9:00',
          OverdueTime: '',
          SuspendTime: '',
          finishTime: '320h'
        }
      ]
    };
    // console.log(JSON.stringify(data));
    var str = template(status, data);
    // console.log(JSON.stringify(str));
    $('#taskList').append(str);

  }

  function showErr(err) {
    console.log(JSON.stringify(err));
    api.hideProgress();
    if (err.body.error != undefined) {
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

      // alert(err.body.error.message)
    } else {
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
      // alert(err.msg);
    }
  }
}

function onMenu(index, el) {
  taskTypeIndex = index;
  if (index == 0) {
    // 任务进行中
    goingPageIndex = 1;
    goingData = [];
    initOngoing();
  } else if (index == 1) {
    // 任务待接收
    receivePageIndex = 1;
    receiveData = [];
    initReceived();
  } else if (index == 2) {
    // 任务已暂停
    suspendPageIndex = 1;
    suspendData = [];
    initSuspended();
  } else if (index == 3) {
    // 任务已完成
    completedPageIndex = 1;
    completeData = [];
    initCompleted();
  }
  onCheckMenu(el, function(){
    // console.log(123);
  });
}

function onOpenTaskDetail(that) {
  if (that != null) {
    // console.log(JSON.stringify($(that)));
    // console.log(id);
    var id = JSON.parse($(that).attr("parse"));
    console.log(JSON.stringify(id));
    // var id = 2;
    api.openWin({
        name: 'homeTaskInfo',
        url: '../Home/homeTaskInfo.html',
        pageParam: {
            type: taskTypeIndex,
            id: id
        }
    });
  }
}

// 点击暂停
function openTaskStop(that) {
  var e = e || window.event;
  e.stopPropagation();
  // 先获取任务详情，再进入暂停页面
  // var taskId = JSON.parse($(that).attr("parse"));
  // var data = {
  //   id: taskId
  // }
  // getTaskBasicInfo("api/services/Inspection/InspectionTaskService/GetTaskDetails",data,showRet,showErr);
  //
  // function showRet(ret) {
  //
  // }

  // function showErr(err) {
    // if(err.code == 1){
    //   alert(err.body.error.message)
    // }else if(err.code == 0){
    //   alert(err.msg);
    // }
  // }

  var taskDetail = {
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

  api.openWin({
      name: 'taskStop',
      url: '../Home/taskStop.html',
      pageParam: {
          name: 'test',
          data: taskDetail
      }
  });
}

// 点击完成任务
function completedTask(that) {
  var e = e || window.event;
  e.stopPropagation();
  var taskId = $(that).attr('parse');
  console.log(taskId);
  var data = {
    taskId: taskId,
    status: 1,
    PageIndex: 1,
    MaxResultCount: 10
  }
  getDaiXunDev(data);
}

// 点击关闭任务
function closeTask(that) {
  var e = e || window.event;
  e.stopPropagation();
  var taskId = $(that).attr('parse');
  var taskName = $(that).attr('taskName');
  var message = '您确定要关闭' + taskName + '吗？'
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
          // 修改状态成功，完成成功
          initReceived();
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

// 点击启动
function startUpTask(that) {
  var e = e || window.event;
  e.stopPropagation();

  var taskId = $(that).attr('parse');
  var data = {
    id: taskId,
    operate: 3
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);

  function showRet(ret) {

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

// 重启任务
function reStartTask(that) {
  var e = e || window.event;
  e.stopPropagation();

  var taskId = $(that).attr('parse');

  var data = {
    id: taskId,
    operate: 5
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);

  function showRet(ret) {

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


// 获取当前任务还有多少个未巡检的设备
function getDaiXunDev(data) {
  // var message = '该任务中有126个待巡点未完成！您确定要完成该任务吗？'
  // api.confirm({
  //     msg: message,
  //     buttons: ['确定', '取消']
  // }, function(ret, err) {
  //     if (ret.buttonIndex == 1) {
  //       //点击确定，完成任务
  //       var param = {
  //         id: data.taskId,
  //         operate: 2
  //       }
  //
  //       changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);
  //
  //       function showRet(ret) {
  //
  //       }
  //
  //       function showErr(err) {
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
  //       }
  //     }
  // });

  getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",data,showRet,showErr);

  function showRet(ret) {
    var daiXunTotal = reet.result.totalCount;
    var message = '该任务中有' + daiXunTotal + '个待巡点未完成！您确定要完成该任务吗？'
    api.confirm({
        msg: message,
        buttons: ['确定', '取消']
    }, function(ret, err) {
        if (ret.buttonIndex == 1) {
          //点击确定，完成任务
          var param = {
            id: data.taskId,
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
    if (err.statusCode == 500) {
      if (err.body.error) {
        api.toast({
            msg: err.body.error.message,
            duration: 2000,
            location: 'middle'
        });
      }
    } else {
      if (err.body.error) {
        api.toast({
            msg: err.body.error.message,
            duration: 2000,
            location: 'middle'
        });
      } else {
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'middle'
        });
      }
    }
  }
}

// 打开新增任务页面
function openAddTask() {
  api.openWin({
      name: 'taskStop',
      url: './addTask.html'
  });
}


function onItemLeft() {
  var e = e || window.event;
  e.stopPropagation();
  console.log('click left');
}

function onItemRight() {
  var e = e || window.event;
  e.stopPropagation();
  console.log('click right');
}

var taskTypeIndex = 0;
var daiXunTotal = 0;

var taskPageSize = 4;

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
  // console.log(footerH);
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
          // console.log('这是进行中的任务');
          if (goingHasNext) {
            // 如果有下一页，则页码++
            goingPageIndex++;
            initOngoing();
          }
          break;
        case 1:
          // console.log('这是待启动的任务');
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
          // console.log('这是已暂停的任务');
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
          // console.log('这是已完成的任务');
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
    MaxResultCount: taskPageSize
  }
  showData(data,'onGoing');
}

// 初始化待接收的任务列表
function initReceived(){
  var data = {
    status: 1,
    pageIndex: receivePageIndex,
    MaxResultCount: taskPageSize
  }
  // console.log(JSON.stringify(data));
  showData(data,'received');
}

// 初始化已暂停的任务列表
function initSuspended(){
  var data = {
    status: 3,
    pageIndex: suspendPageIndex,
    MaxResultCount: taskPageSize
  }
  showData(data,'suspended');
}

// 初始化已完成的任务列表
function initCompleted(){
  var data = {
    status: 4,
    pageIndex: completedPageIndex,
    MaxResultCount: taskPageSize
  }
  showData(data,'completed');
}

function showData(data, status) {
  // console.log(JSON.stringify(data));
  // console.log(data);
  api.showProgress({
    title: '加载中...',
    text: '请稍后',
  });
  getTaskDataSingle({
    data: data,
    success: function (ret) {
      // console.log(JSON.stringify(ret));
      var data;
      var str;

      if (ret.result.items.length != 0) {
        $('#haveNothing').addClass('aui-hide');
        $('#list-box').removeClass('bgc-ff');

        ret.result.items.forEach(function (item, i) {
          if (item.planStartTime != null || item.planStartTime != '') {
            item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
          }

          if (item.startTime != null || item.startTime != '') {
            item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
          }

          if (item.endTime != null || item.endTime != '') {
            item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
          }

          if (item.planEndTime != null || item.planEndTime != '') {
            item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
          }

          if (item.stopTime != null || item.stopTime != '') {
            item.stopTime = parseTime(item.stopTime, '{y}-{m}-{d} {h}:{i}');
          }
        })
        // console.log(JSON.stringify(ret.result.items))
        switch (status) {
          case 'onGoing':
            goingHasNext = ret.result.hasNextPage;
            // if (ret.result.items.length != 0) {
              // ret.result.items.forEach(function (item, i) {
              //   if (item.planStartTime != null || item.planStartTime != '') {
              //     item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.startTime != null || item.startTime != '') {
              //     item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.endTime != null || item.endTime != '') {
              //     item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.planEndTime != null || item.planEndTime != '') {
              //     item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.stopTime != null || item.stopTime != '') {
              //     item.stopTime = parseTime(item.stopTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              // })
            // }
            data = {
              list: ret.result.items
            }
            str = template(status, data);
            break;
          case 'received':
            receiveHasNext = ret.result.hasNextPage;
            // if (ret.result.items.length != 0) {
          //     ret.result.items.forEach(function (item, i) {
          //       if (item.planStartTime != null || item.planStartTime != '') {
          //         item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.startTime != null || item.startTime != '') {
          //         item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.endTime != null || item.endTime != '') {
          //         item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.planEndTime != null || item.planEndTime != '') {
          //         item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //     })
          //   // }
            data = {
              list: ret.result.items
            }

            str = template(status, data);
          //   break;
          case 'suspended':
            suspendHasNext = ret.result.hasNextPage;
          //   // if (ret.result.items.length != 0) {
          //     ret.result.items.forEach(function (item, i) {
          //       if (item.planStartTime != null || item.planStartTime != '') {
          //         item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.startTime != null || item.startTime != '') {
          //         item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.endTime != null || item.endTime != '') {
          //         item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
          //       }
          //
          //       if (item.planEndTime != null || item.planEndTime != '') {
          //         item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
          //       }
              // })
            // }
            data = {
              list: ret.result.items
            }
            str = template(status, data);
            break;
          case 'completed':
            completedHasNext = ret.result.hasNextPage;
            // if (ret.result.items.length != 0) {
              // ret.result.items.forEach(function (item, i) {
              //   if (item.planStartTime != null || item.planStartTime != '') {
              //     item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.startTime != null || item.startTime != '') {
              //     item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.endTime != null || item.endTime != '') {
              //     item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              //
              //   if (item.planEndTime != null || item.planEndTime != '') {
              //     item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
              //   }
              // })
            // }
            data = {
              list: ret.result.items
            }
            str = template(status, data);
            break;
        }

        // console.log(str);
        $('#taskList').append(str);

      } else {
        $('#list-box').addClass('bgc-ff');
        $('#haveNothing').removeClass('aui-hide');
      }

      api.hideProgress();
    }
  });

  // getTaskDataSingle("api/services/Inspection/InspectionTaskService/AppGetTaskList",data,showRet,showErr);
  //
  // function showRet(ret) {
    // var data;
    // var str;
    //
    // if (ret.result.items.length != 0) {
    //   $('#haveNothing').addClass('aui-hide');
    //   $('#list-box').removeClass('bgc-ff');
    //   switch (status) {
    //     case 'onGoing':
    //       goingHasNext = ret.result.hasNextPage;
    //       // if (ret.result.items.length != 0) {
    //         ret.result.items.forEach(function (item, i) {
    //           if (item.planStartTime != null || item.planStartTime != '') {
    //             item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.startTime != null || item.startTime != '') {
    //             item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.endTime != null || item.endTime != '') {
    //             item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.planEndTime != null || item.planEndTime != '') {
    //             item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //         })
    //       // }
    //       data = {
    //         list: ret.result.items
    //       }
    //       str = template(status, data);
    //       break;
    //     case 'received':
    //       receiveHasNext = ret.result.hasNextPage;
    //       // if (ret.result.items.length != 0) {
    //         ret.result.items.forEach(function (item, i) {
    //           if (item.planStartTime != null || item.planStartTime != '') {
    //             item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.startTime != null || item.startTime != '') {
    //             item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.endTime != null || item.endTime != '') {
    //             item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.planEndTime != null || item.planEndTime != '') {
    //             item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //         })
    //       // }
    //       data = {
    //         list: ret.result.items
    //       }
    //
    //       str = template(status, data);
    //       break;
    //     case 'suspended':
    //       suspendHasNext = ret.result.hasNextPage;
    //       // if (ret.result.items.length != 0) {
    //         ret.result.items.forEach(function (item, i) {
    //           if (item.planStartTime != null || item.planStartTime != '') {
    //             item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.startTime != null || item.startTime != '') {
    //             item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.endTime != null || item.endTime != '') {
    //             item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.planEndTime != null || item.planEndTime != '') {
    //             item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //         })
    //       // }
    //       data = {
    //         list: ret.result.items
    //       }
    //       str = template(status, data);
    //       break;
    //     case 'completed':
    //       completedHasNext = ret.result.hasNextPage;
    //       // if (ret.result.items.length != 0) {
    //         ret.result.items.forEach(function (item, i) {
    //           if (item.planStartTime != null || item.planStartTime != '') {
    //             item.planStartTime = parseTime(item.planStartTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.startTime != null || item.startTime != '') {
    //             item.startTime = parseTime(item.startTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.endTime != null || item.endTime != '') {
    //             item.endTime = parseTime(item.endTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //
    //           if (item.planEndTime != null || item.planEndTime != '') {
    //             item.planEndTime = parseTime(item.planEndTime, '{y}-{m}-{d} {h}:{i}');
    //           }
    //         })
    //       // }
    //       data = {
    //         list: ret.result.items
    //       }
    //       str = template(status, data);
    //       break;
    //   }
    //
    //   // console.log(str);
    //   $('#taskList').append(str);
    //
    // } else {
    //   $('#list-box').addClass('bgc-ff');
    //   $('#haveNothing').removeClass('aui-hide');
    // }
    //
    // api.hideProgress();
  // }
  //
  // function showErr(err) {
  //   // console.log(JSON.stringify(err));
  //   api.hideProgress();
  //   $('#haveNothing').removeClass('aui-hide');
  //   if (err.body.error != undefined) {
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //     // alert(err.body.error.message)
  //   } else {
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //     // alert(err.msg);
  //   }
  // }
}

function onMenu(index, el) {
  taskTypeIndex = index;
  $('#taskList').html('');
  if (index == 0) {
    // 任务进行中
    goingPageIndex = 1;
    // goingData = [];
    initOngoing();
  } else if (index == 1) {
    // 任务待接收
    receivePageIndex = 1;
    // receiveData = [];
    initReceived();
  } else if (index == 2) {
    // 任务已暂停
    suspendPageIndex = 1;
    // suspendData = [];
    initSuspended();
  } else if (index == 3) {
    // 任务已完成
    completedPageIndex = 1;
    // completeData = [];
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
    // console.log(JSON.stringify(id));
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
  var taskInfo = JSON.parse($(that).attr("parse"));

  api.openWin({
      name: 'taskStop',
      url: '../Home/taskStop.html',
      pageParam: {
          name: 'test',
          data: taskInfo
      }
  });

  // var data = {
  //   id: taskId
  // }
  // getTaskBasicInfo("api/services/Inspection/InspectionTaskService/GetTaskDetails",data,showRet,showErr);
  //
  // function showRet(ret) {
  //   if (ret.result == null) {
  //     api.toast({
  //         msg: '获取任务详情为空',
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //   } else {
  //     var taskDetail = ret.result;
  //     api.openWin({
  //         name: 'taskStop',
  //         url: '../Home/taskStop.html',
  //         pageParam: {
  //             name: 'test',
  //             data: taskDetail
  //         }
  //     });
  //   }
  // }
  //
  // function showErr(err) {
  //   if (err.body.error != undefined) {
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //     // alert(err.body.error.message)
  //   } else {
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //     // alert(err.msg);
  //   }
  // }

  // var taskDetail = {
  //   id: 1,
  //   name: '测试任务',
  //   type: 1,
  //   typeStr: '临时任务',
  //   status: 1,
  //   statusStr: '进行中',
  //   person: '张三',
  //   planStartTime: '',
  //   areaId: 1,
  //   areaName: '片区1',
  //   planEndTime: '',
  //   participant: '李四、王五',
  //   startTime: '',
  //   endTime: '',
  //   closeReason: '',
  //   stopReason: '',
  //   remark: '备注内容',
  //   pauseTime: '',
  //   orgId: ''
  // }

}

// 点击完成任务
function completedTask(that) {
  var e = e || window.event;
  e.stopPropagation();
  var taskId = Number($(that).attr('parse'));
  // console.log(taskId);
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

  var taskId = Number($(that).attr('parse'));
  var taskName = $(that).attr('taskName');
  var type = $(that).attr('parseType');
  var message = '您确定要关闭' + taskName + '吗？'
  // console.log(taskId);
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

        changeTaskStatus({
          data: param,
          success: function(ret) {
            // 修改状态成功，完成成功，重新加载
            $('#taskList').html('');
            if (type == 'suspended') {
              // 已暂停
              suspendPageIndex = 1;
              initSuspended();
            } else if (type == 'received') {
              // 待接收
              receivePageIndex = 1;
              initReceived();
            }
          }
        })
        // changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);
        //
        // function showRet(ret) {
        //   // 修改状态成功，完成成功，重新加载
        //   $('#taskList').html('');
        //   if (type == 'suspended') {
        //     // 已暂停
        //     suspendPageIndex = 1;
        //     initSuspended();
        //   } else if (type == 'received') {
        //     // 待接收
        //     receivePageIndex = 1;
        //     initReceived();
        //   }
        //
        // }
        //
        // function showErr(err) {
        //   if(err.body.error != undefined){
        //     // alert(err.body.error.message);
        //     api.toast({
        //         msg: err.body.error.message,
        //         duration: 2000,
        //         location: 'middle'
        //     });
        //
        //   }else{
        //     // alert(err.msg);
        //     api.toast({
        //         msg: err.msg,
        //         duration: 2000,
        //         location: 'middle'
        //     });
        //   }
        // }
      }
  });
}

// 点击启动
function startUpTask(that) {
  var e = e || window.event;
  e.stopPropagation();

  var taskId = parseInt($(that).attr('parse'));
  console.log(typeof(Number($(that).attr('parse'))));
  console.log(typeof(taskId));
  var data = {
    id: taskId,
    operate: 3
  }
  console.log(JSON.stringify(data));

  changeTaskStatus({
    data: data,
    success: function() {
      // 启动成功，重新加载待启动列表
      $('#taskList').html('');
      receivePageIndex = 1;
      initReceived();
    }
  })
  // changeTaskStatus('api/services/Inspection/InspectionTaskService/UpdateTaskStatus', data, showRet, showErr);
  //
  // function showRet(ret) {
  //   // 启动成功，重新加载待启动列表
  //   $('#taskList').html('');
  //   receivePageIndex = 1;
  //   initReceived();
  // }
  //
  // function showErr(err) {
  //   if(err.body.error != undefined){
  //     // alert(err.body.error.message);
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //   }else{
  //     // alert(err.msg);
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //   }
  // }
}

// 重启任务
function reStartTask(that) {
  var e = e || window.event;
  e.stopPropagation();

  var taskId = Number($(that).attr('parse'));

  var data = {
    id: taskId,
    operate: 5
  }

  changeTaskStatus({
    data: data,
    success: function(ret) {
      // 重启成功，重新加载已暂停列表
      $('#taskList').html('');
      receivePageIndex = 1;
      initSuspended();
    }
  })
  // changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);
  //
  // function showRet(ret) {
  //   // 重启成功，重新加载已暂停列表
  //   $('#taskList').html('');
  //   receivePageIndex = 1;
  //   initSuspended();
  // }
  //
  // function showErr(err) {
  //   if(err.body.error != undefined){
  //     // alert(err.body.error.message);
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //   }else{
  //     // alert(err.msg);
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //   }
  // }
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
    var daiXunTotal = ret.result.totalCount;
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

          changeTaskStatus({
            data: param,
            success: function(ret) {
              // 修改状态成功，完成成功, 重新加载
              goingPageIndex = 1;
              $('#taskList').html('');
              initOngoing();
            }
          })
          // changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', param, showRet, showErr);
          //
          // function showRet(ret) {
          //   // 修改状态成功，完成成功, 重新加载
          //   goingPageIndex = 1;
          //   $('#taskList').html('');
          //   initOngoing();
          // }
          //
          // function showErr(err) {
          //   if(err.body.error != undefined){
          //     // alert(err.body.error.message);
          //     api.toast({
          //         msg: err.body.error.message,
          //         duration: 2000,
          //         location: 'middle'
          //     });
          //
          //   }else{
          //     // alert(err.msg);
          //     api.toast({
          //         msg: err.msg,
          //         duration: 2000,
          //         location: 'middle'
          //     });
          //   }
          // }
        }
    });
  }

  function showErr(err) {
    if (err.body.error != undefined) {
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

// 打开新增任务页面
function openAddTask() {
  api.openWin({
      name: 'addTask',
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

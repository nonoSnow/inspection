// 当前任务类型（0：进行中:1：待启动:2：已暂停:3：已完成）
var nowTaskType;

// 任务id
var taskId = 0;

// 当前tab下标
var taskDetype;

// 每页数据条数
var xunPageSize = 30;

// 任务详情
var taskDetail;
// 待巡总数（点击完成时提示需要）
// var daixunTotal;

var daixunPageIndex = 1;
var daixunHasNext = false;
// var daixunData = [];

var yixunPageIndex = 1;
var yixunHasNext = false;
// var yixunData = [];

var footerH;

var indexMap = {};

var mapInfo;

// 区域id
var areaId;

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  var footer = $api.byId('footer');
  footerH = $api.offset(footer).h;



  nowTaskType = api.pageParam.type;
  taskId = api.pageParam.id;
  // console.log(taskId);

  // console.log(api.pageParam.id);
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
    $('#footer').addClass('aui-hide');
    $('.flex-con').removeClass('margin-bot250');
  }

  // 初始化信息
  initTaskDetail();
  onMenu(0, '');

  // 监听上拉
  $('#list-box').scroll(function() {
    var h = $(this).height(); // 可视化高度(681)
    var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
    var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

    // console.log(h);

    if (h + Math.ceil(st) >= sh) {
      switch (taskDetype) {
        case 0:
          // console.log('基础信息，不操作');
          break;
        case 1:
          // console.log('这是待巡点列表');
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
          // console.log('这是已巡点列表');
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

  api.addEventListener({
      name: 'fromNormal'
  }, function(ret, err){
      if( ret ){
        onMenu(taskDetype, '');
      }else{
        console.log( JSON.stringify( err ) );
      }
  });

}

function onMenu(index, el) {
  if (taskId == undefined) {
    api.toast({
        msg: '未获取到任务',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  taskDetype = index;
  if (index == 0) {
    // 显示详情
    $('#daixunBox').addClass('aui-hide');
    $('#yixunBox').addClass('aui-hide');
    $('#taskDetail').removeClass('aui-hide');


  } else if (index == 1) {
    // 显示待巡
    $('#taskDetail').addClass('aui-hide');
    $('#yixunBox').addClass('aui-hide');
    $('#daixunBox').removeClass('aui-hide');
  } else if (index == 2) {
    // 显示已巡
    $('#taskDetail').addClass('aui-hide');
    $('#daixunBox').addClass('aui-hide');
    $('#yixunBox').removeClass('aui-hide');
  }
  if (index == 0) {
    // $(".task-info").removeClass('aui-hide');
    if (nowTaskType != 3) {
      $(".footer").removeClass('aui-hide');
    }

    // console.log('点击了基础信息');
    // $('#taskDetail').addClass('margin-bot100');
    // $(".task-list").addClass('aui-hide');
    $(".flex-con").addClass('margin-bot250');
    // initTaskDetail();
  } else if(index == 1 || index == 2) {
    // $(".task-info").addClass('aui-hide');
    $(".footer").addClass('aui-hide');
    // $('#taskDetail').removeClass('margin-bot100');
    // $(".task-list").removeClass('aui-hide');
    $(".flex-con").removeClass('margin-bot250');

    if (index == 1) {
      // $('.item-btn').addClass('aui-hide');
      // $('.inspector').addClass('aui-hide');
      // $('.completion-time').addClass('aui-hide');
      daixunPageIndex = 1;
      // daixunData = [];
      $('#daixunBox').html('');
      initToBeInspected();
    } else {
      // $('.item-btn').removeClass('aui-hide');
      // $('.inspector').removeClass('aui-hide');
      // $('.completion-time').removeClass('aui-hide');
      yixunPageIndex = 1;
      // yixunData = [];
      $('#yixunBox').html('');
      initInspected();
    }
  }
  if (el == '') {
    return;
  }
  onCheckMenu(el, function(){
    // console.log(123);
  });
}

// 点击待巡检
function onOpenEquipment(that) {
  // if (that != null) {
    var data = JSON.parse($(that).attr("parse"));
    // console.log(JSON.stringify(data));
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
            data: data,
            taskId: taskId,
            taskType: nowTaskType
        }
    });
  // }
}


function onOpenTaskDetail(that) {
  var data = $(that).attr('parse');
  data = JSON.parse(data);
  data.taskId = taskId;
  data.areaId = areaId;
  // console.log(JSON.stringify(mapInfo));
  // console.log(areaId);
  // console.log(JSON.stringify(data));
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
    // console.log('点击了完成');
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

  changeTaskStatus({
    data: data,
    success: function(ret) {
        api.sendEvent({
            name: 'returnList',
            extra: {
                back: 1,
            }
        });
        api.closeWin({});
    }
  })
  // changeTaskStatus('api/services/Inspection/InspectionTaskService/UpdateTaskStatus', data, showRet, showErr);
  //
  // function showRet(ret) {
  //   // 修改状态成功，关闭成功
  //   openTask();
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

// 关闭
function closeTask() {
  // console.log(JSON.stringify(taskDetail));
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

        changeTaskStatus({
          data: param,
          success: function(ret) {
              api.closeWin();
          }
        })
        // changeTaskStatus('api/services/Inspection/InspectionTaskService/UpdateTaskStatus', param, showRet, showErr);
        //
        // function showRet(ret) {
        //   // 修改状态成功，关闭成功
        //   api.closeWin();
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

// 重启
function reStartTask() {
  var data = {
    id: taskId,
    operate: 5
  }

  changeTaskStatus({
    data: data,
    success: function(ret) {
        // openTask();
        api.sendEvent({
            name: 'returnList',
            extra: {
                back: 1,
            }
        });
        api.closeWin({});
    }
  })
  // changeTaskStatus('api/services/Inspection/InspectionTaskService/UpdateTaskStatus', data, showRet, showErr);
  //
  // function showRet(ret) {
  //   openTask();
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

// 完成
function complete() {
  var data = {
    taskId: taskId,
    status: 1,
    PageIndex: 1,
    MaxResultCount: 10
  }

  getInspectDataList({
    data: data,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      var daixunTotal = ret.result.totalCount;
      // console.log(daixunTotal);
      var message = '该任务中有' + daixunTotal + '个待巡点未完成！您确定要完成该任务吗？';
      // console.log(message);
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

            changeTaskStatus({
              data: param,
              success: function(ret) {
                  // initOngoing();
                  api.closeWin({});

              }
            })
          }
      });
    }
  })
  // getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",data,showRet,showErr);
  //
  // function showRet(ret) {
  //   daixunTotal = ret.result.totalCount;
  //   var message = '该任务中有' + daiXunTotal + '个待巡点未完成！您确定要完成该任务吗？'
  //   api.confirm({
  //       msg: message,
  //       buttons: ['确定', '取消']
  //   }, function(ret, err) {
  //       if (ret.buttonIndex == 1) {
  //         //点击确定，完成任务
  //         var param = {
  //           id: taskId,
  //           operate: 2
  //         }
  //
  //         changeTaskStatus({
  //           data: param,
  //           success: function(ret) {
  //               initOngoing();
  //           }
  //         })
  //
  //         // changeTaskStatus('api/services/Inspection/InspectionTaskService/UpdateTaskStatus', param, showRet, showErr);
  //         //
  //         // function showRet(ret) {
  //         //   // 修改状态成功，完成成功
  //         //   initOngoing();
  //         // }
  //         //
  //         // function showErr(err) {
  //         //   if(err.body.error != undefined){
  //         //     // alert(err.body.error.message);
  //         //     api.toast({
  //         //         msg: err.body.error.message,
  //         //         duration: 2000,
  //         //         location: 'middle'
  //         //     });
  //         //
  //         //   }else{
  //         //     // alert(err.msg);
  //         //     api.toast({
  //         //         msg: err.msg,
  //         //         duration: 2000,
  //         //         location: 'middle'
  //         //     });
  //         //   }
  //         // }
  //       }
  //   });
  // }
  //
  // function showErr(err) {
  //
  // }
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
  // console.log('进入初始化基础信息了');
  getTaskDetail(data);
}

// 初始化待巡点列表
function initToBeInspected() {
  var data = {
    taskId: taskId,
    status: 1,
    PageIndex: daixunPageIndex,
    MaxResultCount: xunPageSize
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
  // taskDetail = {
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
  // var str = template('taskBasicInfo', taskDetail);
  // console.log(JSON.stringify(str));
  // console.log(JSON.stringify($('#taskDetail').html()));
  // $('#taskDetail').append(str);
  // console.log(JSON.stringify($('#taskDetail').html()));

  getTaskBasicInfo({
    data: param,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      taskDetail = ret.result;
      $('#taskDetail').html('');
      if (ret.result.planStartTime != null || ret.result.planStartTime != '') {
        // ret.result.planStartTime = parseTime(ret.result.planStartTime, '{y}-{m}-{d} {h}:{i}');
        ret.result.planStartTime = moment(ret.result.planStartTime).format('YYYY-MM-DD HH:mm');
      }

      if (ret.result.planEndTime != null || ret.result.planEndTime != '') {
        // ret.result.planEndTime = parseTime(ret.result.planEndTime, '{y}-{m}-{d} {h}:{i}');
        ret.result.planEndTime = moment(ret.result.planEndTime).format('YYYY-MM-DD HH:mm');
      }

      if (ret.result.startTime != null || ret.result.startTime != '') {
        // ret.result.startTime = parseTime(ret.result.startTime, '{y}-{m}-{d} {h}:{i}');
        ret.result.startTime = moment(ret.result.startTime).format('YYYY-MM-DD HH:mm');
      }

      if (ret.result.endTime != null || ret.result.endTime != '') {
        // ret.result.endTime = parseTime(ret.result.endTime, '{y}-{m}-{d} {h}:{i}');
        ret.result.endTime = moment(ret.result.endTime).format('YYYY-MM-DD HH:mm');
      }

      // if (ret.result.participants != 0) {
      //   // 有参与人
      //   var participant = '';
      //   ret.result.participants.forEach(function(item, index) {
      //     if (index != 0) {
      //       participant += ('、' + item);
      //     } else {
      //       participant += item;
      //     }
      //   })
      //   ret.result.participant = participant;
      // }
      // console.log(JSON.stringify(ret.result));

      var data = ret.result;
      var str = template('taskBasicInfo', data);
      // console.log(str);
      $('#taskDetail').append(str);

      areaId = ret.result.areaId;

      var data = {
        id: ret.result.areaId
      }
      api.showProgress({
          title: '正在加载区域信息...',
          text: '',
          modal: false
      });

      getAreaDetails({
        data: data,
        success: function(ret1) {
          // console.log(JSON.stringify(ret1));
          api.hideProgress();

          mapInfo = ret1.result;
          // console.log(JSON.stringify(mapInfo));
          // console.log(indexMap);
          // console.log($('#mapBox'));
          console.log($.isEmptyObject(indexMap));
          if ($.isEmptyObject(indexMap)) {
            indexMap = new Map({
                mapid: 'mapBox'
            });
          }

          indexMap.initArea('addArea');
          indexMap.initDeviceLayer('addArea');
          // var areaPoint = ret1.areaPoint;
          // console.log(JSON.stringify(mapInfo));
          // console.log(typeof(mapInfo.areaPoint));
          // console.log(mapInfo.areaPoint);
          indexMap.drawAreaSelect(mapInfo.areaPoint, {
            name: 'addArea',
            areaId: mapInfo.id
          });
          // indexMap.mapConduitEquipment({
          //     areaPoint: mapInfo.areaPoint,
          //     lineList: mapInfo.pipelineLists,
          //     pointList: mapInfo.deviceLists
          // }, {
          //   name: 'addArea',
          //   areaId: mapInfo.id
          // });
        },
        fail: function(err) {
          api.hideProgress();
        }
      })
    }
  })
  // getTaskBasicInfo("api/services/Inspection/InspectionTaskService/GetTaskDetails",param,showRet,showErr);
  //
  // function showRet(ret) {
  //   // console.log(JSON.stringify(ret));
  //   $('#taskDetail').html('');
  //   // var data = {
  //   //   Id: 1,
  //   //   name: '测试任务',
  //   //   type: 1,
  //   //   typeStr: '临时任务',
  //   //   status: 1,
  //   //   statusStr: '进行中',
  //   //   person: '张三',
  //   //   planStartTime: '',
  //   //   areaId: 1,
  //   //   areaName: '片区1',
  //   //   planEndTime: '',
  //   //   participant: '李四、王五',
  //   //   startTime: '',
  //   //   endTime: '',
  //   //   closeReason: '',
  //   //   stopReason: '',
  //   //   remark: '备注内容',
  //   //   pauseTime: '',
  //   //   orgId: ''
  //   // }
  //   if (ret.result.planStartTime != null || ret.result.planStartTime != '') {
  //     ret.result.planStartTime = parseTime(ret.result.planStartTime, '{y}-{m}-{d} {h}:{i}');
  //   }
  //
  //   if (ret.result.planEndTime != null || ret.result.planEndTime != '') {
  //     ret.result.planEndTime = parseTime(ret.result.planEndTime, '{y}-{m}-{d} {h}:{i}');
  //   }
  //
  //   if (ret.result.startTime != null || ret.result.startTime != '') {
  //     ret.result.startTime = parseTime(ret.result.startTime, '{y}-{m}-{d} {h}:{i}');
  //   }
  //
  //   if (ret.result.endTime != null || ret.result.endTime != '') {
  //     ret.result.endTime = parseTime(ret.result.endTime, '{y}-{m}-{d} {h}:{i}');
  //   }
  //
  //   var data = ret.result;
  //   var str = template('taskBasicInfo', data);
  //   $('#taskDetail').append(str);
  //
  //   // 获取地图信息及渲染
  //   console.log(ret.areaId);
  //   var data = {
  //     id: ret.areaId
  //   }
  //
  //   getAreaDetails('api/services/Inspection/AreaService/GetGetAreaDetails' ,data, showRet, showErr)
  //
  //   function showRet(ret) {
  //     // 请求成功，初始化地图
  //   }
  //
  //   function showErr(err) {
  //
  //   }
  // }
  //
  // function showErr(err) {
  //     if(err.body.error != undefined){
  //       // alert(err.body.error.message);
  //       api.toast({
  //           msg: err.body.error.message,
  //           duration: 2000,
  //           location: 'middle'
  //       });
  //
  //     }else{
  //       // alert(err.msg);
  //       api.toast({
  //           msg: err.msg,
  //           duration: 2000,
  //           location: 'middle'
  //       });
  //     }
  // }
}

// 获取巡检点列表
function getInspecteList(param, status) {
  // var data = {
  //   list: [
  //     {
  //       id: 1,
  //       name: '蝶阀',
  //       code: 'code 19886674503',
  //       address: '渝中区上清寺9号',
  //       status: 2
  //     },
  //     {
  //       id: 2,
  //       name: '阀门',
  //       code: 'code 19886674503',
  //       address: '渝中区上清寺9号',
  //       status: 3
  //     }
  //   ]
  // }
  // console.log(status);
  // var str = template(status, data);
  // console.log(JSON.stringify(str));
  // $('#taskDetail').append(str);
  // console.log(JSON.stringify($('#taskDetail').html()));

  api.showProgress({
    title: '加载中...',
    text: '请稍后'
  });

  getInspectDataList({
    data: param,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      var str;
      if (ret.result.items != 0) {
        $('#haveNothing').addClass('aui-hide');
        switch (status) {
          case 'toBeInspected':
            // 待巡
            daixunHasNext = ret.result.hasNextPage;
            var data = {
              list: ret.result.items
            }
            str = template(status, data);
            $('#daixunBox').append(str);
            break;
          case 'inspected':
            // 已巡
            ret.result.items.forEach(function (item, i) {
              if (item.time != '' || item.time != null) {
                item.time = parseTime(item.time, '{y}-{m}-{d} {h}:{i}');
              }
            })
            yixunHasNext = ret.result.hasNextPage;
            var data = {
              list: ret.result.items
            }
            str = template(status, data);
            $('#yixunBox').append(str);
            break;
        }
      } else {
        $('#haveNothing').removeClass('aui-hide');
      }

      api.hideProgress();
      // $('#taskDetail').append(str);
    },
    fail: function(err) {
      api.hideProgress();
      if (err == undefined) {
        api.toast({
            msg: '数据加载失败',
            duration: 2000,
            location: 'middle'
        });
      } else if (err.body == undefined) {
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'middle'
        });
      } else if (err.body.error != undefined) {
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
  })
  // getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",param,showRet,showErr);
  //
  // function showRet(ret) {
  //   console.log(JSON.stringify(ret));
  //
  //   var str;
  //     // $('#taskDetail').html('');
  //     if (ret.result.items != 0) {
  //       $('#haveNothing').addClass('aui-hide');
  //
  //       switch (status) {
  //         case 'toBeInspected':
  //           // 待巡
  //           daixunHasNext = ret.result.hasNextPage;
  //           ret.result.items.forEach(function (item, i) {
  //
  //           })
  //           // if (ret.result.items.length != 0) {
  //           //   for (var i = 0; i < ret.result.items.length; i++) {
  //           //     daixunData.push(ret.result.items[i]);
  //           //   }
  //           // }
  //           var data = {
  //             list: ret.result.items
  //           }
  //           str = template(status, data);
  //           break;
  //         case 'inspected':
  //           // 已巡
  //           yixunHasNext = ret.result.hasNextPage;
  //           // if (ret.result.items.length != 0) {
  //           //   for (var i = 0; i < ret.result.items.length; i++) {
  //           //     yixunData.push(ret.result.items[i]);
  //           //   }
  //           // }
  //           var data = {
  //             list: ret.result.items
  //           }
  //           str = template(status, data);
  //           break;
  //       }
  //     } else {
  //       $('#haveNothing').removeClass('aui-hide');
  //     }
  //
  //
  //     api.hideProgress();
  //
  //     // var data = {
  //     //   list: [
  //     //     {
  //     //       Id: 1,
  //     //       name: '蝶阀',
  //     //       code: 'code 19886674503',
  //     //       address: '渝中区上清寺9号'
  //     //     },
  //     //     {
  //     //       Id: 2,
  //     //       name: '阀门',
  //     //       code: 'code 19886674503',
  //     //       address: '渝中区上清寺9号'
  //     //     }
  //     //   ]
  //     // }
  //     //
  //     // var str = template(status, data);
  //     $('#taskDetail').append(str);
  // }
  //
  // function showErr(err) {
  //   api.hideProgress();
  //   $('#haveNothing').removeClass('aui-hide');
  //     if(err.body.error != undefined){
  //       // alert(err.body.error.message);
  //       api.toast({
  //           msg: err.body.error.message,
  //           duration: 2000,
  //           location: 'middle'
  //       });
  //
  //     }else{
  //       // alert(err.msg);
  //       api.toast({
  //           msg: err.msg,
  //           duration: 2000,
  //           location: 'middle'
  //       });
  //     }
  // }
}

// function openTask() {
//   api.openWin({
//       name: 'Task',
//       url: '../task/task.html'
//   });
// }

// 打开地图页面
function openViewMap() {
  // console.log(JSON.stringify(mapInfo));
  api.openWin({
      name: 'viewMap',
      url: '../Task/viewMap.html',
      pageParam: {
        mapInfo: mapInfo
      }
  });

}

// 返回列表页
function backList() {
  api.sendEvent({
      name: 'returnList',
      extra: {
          back: 1,
      }
  });
  api.closeWin({});
}

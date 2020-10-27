
var nowTaskType;
var taskId = 0;
var taskDetail;

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
      initToBeInspected();
    } else {
      // $('.item-btn').removeClass('aui-hide');
      // $('.inspector').removeClass('aui-hide');
      // $('.completion-time').removeClass('aui-hide');
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

  } else if (nowTaskType == '2') {
    // 已暂停任务
    // 点击了关闭
  }
}

// 点击第二个按钮
function clickSecond() {
  if (nowTaskType == '0') {
    // 进行中任务
    // 点击了完成
    console.log('点击了完成');
  } else if (nowTaskType == '1') {
    // 待启动任务
    // 点击了启动

  } else if (nowTaskType == '2') {
    // 已暂停任务
    // 点击了重启
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
    PageIndex: 1,
    MaxResultCount: 10
  }

  getInspecteList(data, 'toBeInspected');
}

// 初始化已巡点列表
function initInspected() {
  var data = {
    taskId: taskId,
    status: 2,
    PageIndex: 1,
    MaxResultCount: 10
  }
  getInspecteList(data, 'inspected');
}

// 获取任务详情基础信息
function getTaskDetail(param) {
  // console.log('进入请求基础信息了');
  $('#taskDetail').html('');
  taskDetail = {
    Id: 1,
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
      // if(err.code == 1){
      //   alert(err.body.error.message)
      // }else if(err.code == 0){
      //   alert(err.msg);
      // }
  // }
}

// 获取巡检点列表
function getInspecteList(param, status) {
  $('#taskDetail').html('');
  var data = {
    list: [
      {
        Id: 1,
        name: '蝶阀',
        code: 'code 19886674503',
        address: '渝中区上清寺9号',
        status: 2
      },
      {
        Id: 2,
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

  // getInspectDataList("api/services/Inspection/InspectionTaskService/AppGetInspectionPointList",param,showRet,showErr);
  //
  // function showRet(ret) {
  //     // $('#taskDetail').html('');
  //
  //     var data = {
  //       list: [
  //         {
  //           Id: 1,
  //           name: '蝶阀',
  //           code: 'code 19886674503',
  //           address: '渝中区上清寺9号'
  //         },
  //         {
  //           Id: 2,
  //           name: '阀门',
  //           code: 'code 19886674503',
  //           address: '渝中区上清寺9号'
  //         }
  //       ]
  //     }
  //
  //     var str = template(status, data);
  //     $('#taskDetail').append(str);
  // }
  //
  // function showErr(err) {
    // if(err.code == 1){
    //   alert(err.body.error.message)
    // }else if(err.code == 0){
    //   alert(err.msg);
    // }
  // }
}

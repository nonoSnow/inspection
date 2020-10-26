var taskTypeIndex = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  initOngoing();
}

// 初始化进行中的任务列表
function initOngoing(){
  var data = {
    status: 2,
    pageIndex: 1,
    MaxResultCount: 10
  }
  showData(data,'onGoing');
}

// 初始化待接收的任务列表
function initReceived(){
  var data = {
    status: 1,
    pageIndex: 1,
    MaxResultCount: 10
  }
  showData(data,'received');
}

// 初始化已暂停的任务列表
function initSuspended(){
  var data = {
    status: 3,
    pageIndex: 1,
    MaxResultCount: 10
  }
  showData(data,'suspended');
}

// 初始化已完成的任务列表
function initCompleted(){
  var data = {
    status: 4,
    pageIndex: 1,
    MaxResultCount: 10
  }
  showData(data,'completed');
}

function showData(data, status) {
  $('#taskList').html('');
  getTaskDataSingle("api/services/Inspection/InspectionTaskService/AppGetTaskList",data,showRet,showErr);

  function showRet(ret) {
    console.log(JSON.stringify(ret));
    // $('#taskList').html('');
    // console.log(JSON.stringify($('#taskList').html()));
    var data = {
      list: [
        {
          Id: "1",
          name: '测试任务',
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
          Id: "2",
          name: '测试任务1',
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

  function showErr(err){
    // console.log(JSON.stringify(err));
    if(err.code == 1){
      alert(err.body.error.message)
    }else if(err.code == 0){
      alert(err.msg);
    }
  }
}

function onMenu(index, el) {
  taskTypeIndex = index;
  if (index == 0) {
    // 任务进行中
    initOngoing();
  } else if (index == 1) {
    // 任务待接收
    initReceived();
  } else if (index == 2) {
    // 任务已暂停
    initSuspended();
  } else if (index == 3) {
    // 任务已完成
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
    // console.log(JSON.stringify(data));
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

  api.openWin({
      name: 'taskStop',
      url: '../Home/taskStop.html',
      pageParam: {
          name: 'test',
          data: taskDetail
      }
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

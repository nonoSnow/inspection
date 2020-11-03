// 设备详情
var inspectParam;
// 任务id
var taskId;

// 是否有数据，如果没有数据，无法上报且无法操作
var hasOperate = false;

// 设备详情
var inspectDetail;

// 当前任务状态（只有进行中的任务能走上报事件或者正常）
var type;

// 是否可以操作上报事件和正常
var isOper = false;

// console.log('---------------------');
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  // console.log('进入设备详情页面了');
  inspectParam = api.pageParam.data;
  taskId = api.pageParam.taskId;
  type = api.pageParam.taskType;

  console.log(type);


  console.log(JSON.stringify(inspectParam));
  console.log(taskId);
  getInspectDetail();
  initBtn();
}

function initBtn() {
  if (type == 0) {
    // 进行中的任务，可以上报事件和正常
    $('#normal').removeClass('btn-disabled');
    $('#shangbao').removeClass('btn-disabled');
    isOper = true;
  } else {
    // 其他状态不允许上报事件和正常
    $('#normal').addClass('btn-disabled');
    $('#shangbao').addClass('btn-disabled');
    isOper = false;
  }
}

function onOpenReport() {
  if (isOper) {
    // if (hasOperate) {
      var data = inspectParam;
      data.taskId = taskId;
      console.log(JSON.stringify(data));
      api.openWin({
          name: 'addMethodReport',
          url: '../Method/addMethodReport.html',
          pageParam: {
              name: 'test',
              data: data
          }
      });
    // } else {
    //   api.toast({
    //       msg: '无设备信息，无法上报事件',
    //       duration: 2000,
    //       location: 'middle'
    //   });
    //
    // }
  }

}

function onOpenSubmit() {
  if (isOper) {
    if (hasOperate) {
      api.openWin({
          name: 'taskInfoSubmit',
          url: './taskInfoSubmit.html',
          pageParam: {
              type: 'handle',
              data: inspectParam
          }
      });
    } else {
      api.toast({
          msg: '无设备信息，无法操作',
          duration: 2000,
          location: 'middle'
      });
    }
  }

}

function onOpenInspectionRecord() {
  // if (hasOperate) {
    api.openWin({
        name: 'inspectionRecord',
        url: '../Method/inspectionRecord.html',
        pageParam: {
            name: 'test',
            devInfo: inspectDetail
        }
    });
  // } else {
  //   api.toast({
  //       msg: '无设备信息，无法操作',
  //       duration: 2000,
  //       location: 'middle'
  //   });
  // }

}

function getInspectDetail() {
  $('#inspectDetailBox').html('');

  // var data = {
  //   id: 1,
  //   name: '阀门',
  //   code: 'code 983946765w',
  //   point: '123.4545,234.5623',
  //   person: '张飒',
  //   address: '上清寺9号',
  //   inspectionStatus: 1,
  //   inspectionStatusStr: '未巡检'
  // }
  // var str = template('inspectDetail', data);
  // $('#inspectDetailBox').append(str);
  // console.log(JSON.stringify($('#inspectDetailBox').html()));

  var data = {
    deviceId: inspectParam.id,
    taskId: taskId,
    status: inspectParam.status,
    inspectionStatus: inspectParam.inspectionStatus
  }

  getInspectDetails('api/services/Inspection/InspectionTaskService/GetPointDetails', inspectParam, showRet, showRet);

  function showRet(ret) {
    console.log(JSON.stringify(ret));

    if (ret.result != null) {
      hasOperate = true;
      inspectDetail = ret.result;
      var str = template('inspectDetail', ret.result);
      $('#inspectDetailBox').append(str);
    } else {
      hasOperate = false;
      api.toast({
          msg: '无设备信息',
          duration: 2000,
          location: 'middle'
      });
    }
  }

  function showErr(err) {
    hasOperate = false;
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

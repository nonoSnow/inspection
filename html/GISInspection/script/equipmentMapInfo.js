// 设备详情
var inspectParam;
// 任务id
var taskId;

// 是否有数据，如果没有数据，无法上报且无法操作
var hasOperate = false;


// console.log('---------------------');
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  // console.log('进入设备详情页面了');
  inspectParam = api.pageParam.data;
  taskId = api.pageParam.taskId;

  console.log(JSON.stringify(inspectParam));
  console.log(taskId);
  getInspectDetail();
}

function onOpenReport() {
  if (hasOperate) {
    api.openWin({
        name: 'addMethodReport',
        url: '../Method/addMethodReport.html',
        pageParam: {
            name: 'test',
            data: inspectParam
        }
    });
  } else {
    api.toast({
        msg: '无设备信息，无法上报事件',
        duration: 2000,
        location: 'middle'
    });

  }

}

function onOpenSubmit() {
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

function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test',
          devInfo: inspectParam
      }
  });
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

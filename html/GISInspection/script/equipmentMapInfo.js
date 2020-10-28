// 设备详情
var inspectParam;
// 任务id
var taskId;

console.log('---------------------');
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  console.log('进入设备详情页面了');
  inspectParam = api.pageParam.data;
  taskId = api.pageParam.taskId;

  console.log(JSON.stringify(inspectParam));
  getInspectDetail();
}

function onOpenReport() {
  api.openWin({
      name: 'addMethodReport',
      url: '../Method/addMethodReport.html',
      pageParam: {
          name: 'test'
      }
  });
}

function onOpenSubmit() {

  api.openWin({
      name: 'taskInfoSubmit',
      url: './taskInfoSubmit.html',
      pageParam: {
          type: 'handle',
          data: inspectParam
      }
  });

}

function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test'
      }
  });
}

function getInspectDetail() {
  $('#inspectDetailBox').html('');

  var data = {
    id: 1,
    name: '阀门',
    code: 'code 983946765w',
    point: '123.4545,234.5623',
    person: '张飒',
    address: '上清寺9号',
    inspectionStatus: 1,
    inspectionStatusStr: '未巡检'
  }
  var str = template('inspectDetail', data);
  $('#inspectDetailBox').append(str);
  console.log(JSON.stringify($('#inspectDetailBox').html()));

  // getInspectDetails('api/services/Inspection/InspectionTaskService/GetPointDetails', inspectParam, showRet, showRet);
  //
  // function showRet(ret) {
  //
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

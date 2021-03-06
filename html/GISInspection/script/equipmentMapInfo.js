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

var indexMap = {};

// console.log('---------------------');
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  // console.log('进入设备详情页面了');
  inspectParam = api.pageParam.data;
  taskId = api.pageParam.taskId;
  type = api.pageParam.taskType;

  // console.log(JSON.stringify(inspectParam));
  // console.log(type);


  // console.log(JSON.stringify(inspectParam));
  // console.log(taskId);
  getInspectDetail();
  initBtn();

  // 初始化地图
  initMap();
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
    if (hasOperate) {
      var data = inspectParam;
      data.taskId = taskId;
      // console.log(JSON.stringify(data));
      api.openWin({
          name: 'addMethodReport',
          url: '../Method/addMethodReport.html',
          pageParam: {
              name: 'test',
              data: data
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

}

function onOpenSubmit() {
  if (isOper) {
    if (hasOperate) {
      var data = inspectParam;
      data.taskId = taskId;
      api.openWin({
          name: 'taskInfoSubmit',
          url: './taskInfoSubmit.html',
          pageParam: {
              type: 'handle',
              data: data
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
  if (hasOperate) {
    api.openWin({
        name: 'inspectionRecord',
        url: '../Method/inspectionRecord.html',
        pageParam: {
            name: 'test',
            devInfo: inspectDetail
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

  // console.log(JSON.stringify(data));
  getInspectDetails('api/services/Inspection/InspectionTaskService/GetPointDetails', data, showRet, showRet);

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

// 导航
function goHere() {
  if (hasOperate) {
    var pointStr = inspectDetail.point;
    var data = pointStr.split(',');
    var navigator = new Navigator(data);

  } else {
    hasOperate = false;
    api.toast({
        msg: '无设备信息',
        duration: 2000,
        location: 'middle'
    });
  }
}

// 通过任务id获取片区内容展示片区及设备
function initMap() {
  var data = {
    id: taskId
  }
  getTaskBasicInfo({
    data: data,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      var param = {
        id: ret.result.areaId
      }
      getAreaDetails({
        data: param,
        success: function(ret1) {
          // console.log(JSON.stringify(ret1));
          var mapInfo = ret1.result;
          var pointList = [];
          var lineList = [];
          if (inspectParam.point) {
            pointList = inspectParam.point.split(',');
          } else {
            pointList = inspectParam.devicePoint.split(',');
          }

          // console.log(JSON.stringify(mapInfo));
          indexMap = new Map({
              mapid: 'mapBox'
          });
          indexMap.initArea('addArea');
          indexMap.initDeviceLayer('addArea');

          indexMap.drawAreaSelect(mapInfo.areaPoint, {
            name: 'addArea',
            areaId: mapInfo.id
          });
          indexMap.mapConduitEquipment({
              areaPoint: mapInfo.areaPoint,
              lineList: lineList,
              pointList: pointList
          }, {name: 'addArea'});
        },
        fail: function(err) {
          // if (err.body.error != undefined) {
          //   api.toast({
          //       msg: err.body.error.message,
          //       duration: 2000,
          //       location: 'middle'
          //   });
          //
          // } else {
          //   api.toast({
          //       msg: err.msg,
          //       duration: 2000,
          //       location: 'middle'
          //   });
          // }
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
    },
    fail: function(err) {
      // if (err.body.error != undefined) {
      //   api.toast({
      //       msg: err.body.error.message,
      //       duration: 2000,
      //       location: 'middle'
      //   });
      //
      // } else {
      //   api.toast({
      //       msg: err.msg,
      //       duration: 2000,
      //       location: 'middle'
      //   });
      // }
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
}

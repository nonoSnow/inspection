// 我的任务

// 获取我的任务接口数据
function getTaskDataSingle(options) {
  // var userLoginInformation= $api.getStorage('userLoginInformation');
  // var data = options.data;

  var options = Object.assign({}, options, {
      url: requestUrl + 'InspectionTaskService/AppGetTaskList',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  // alert(JSON.stringify(options))
  ajaxMethod(options);
}

// function getTaskDataSingle(path,data,showRet,showErr){
//   console.log(baseUrl+path);
//   var options = {
//     url:baseUrl+path,
//     data:data,
//     success:function(ret){
//       // console.log(JSON.stringify(ret));
//       showRet(ret)
//     },
//     error:function(err){
//       // console.log(JSON.stringify(err));
//       showErr(err)
//     }
//   }
//   ajaxMethod(options)
// }

// 获取领导任务接口数据
function getJobDataAll(){}

// 获取任务详情基础信息
function getTaskBasicInfo(options) {
  var options = Object.assign({}, options, {
      url: requestUrl + 'InspectionTaskService/GetTaskDetails',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  ajaxMethod(options);
}
// function getTaskBasicInfo(path,data,showRet,showErr) {
//   var options = {
//     url:baseUrl+path,
//     data:data,
//     success:function(ret){
//       // console.log(JSON.stringify(ret));
//       showRet(ret)
//     },
//     error:function(err){
//       // console.log(JSON.stringify(err));
//       showErr(err)
//     }
//   }
//   ajaxMethod(options)
// }

// 获取任务详情（巡检点列表）
function getInspectDataList(options) {
  var options = Object.assign({}, options, {
      url: requestUrl + 'InspectionTaskService/AppGetInspectionPointList',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  ajaxMethod(options);
}
// function getInspectDataList(path,data,showRet,showErr) {
//   var options = {
//     url:baseUrl+path,
//     data:data,
//     success:function(ret){
//       // console.log(JSON.stringify(ret));
//       showRet(ret)
//     },
//     error:function(err){
//       // console.log(JSON.stringify(err));
//       showErr(err)
//     }
//   }
//   ajaxMethod(options)
// }

// 获取巡检设备详情
function getInspectDetails(path,data,showRet,showErr) {
  var options = {
    url:baseUrl+path,
    data:data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret)
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err)
    }
  }
  ajaxMethod(options)
}

// 任务状态变更
function changeTaskStatus(options) {
  var options = Object.assign({}, options, {
      url: requestUrl + 'InspectionTaskService/UpdateTaskStatus',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  ajaxMethod(options);
}
// function changeTaskStatus(path,data,showRet,showErr) {
//   var options = {
//     url: baseUrl+path,
//     data: data,
//     success:function(ret){
//       // console.log(JSON.stringify(ret));
//       showRet(ret)
//     },
//     error:function(err){
//       // console.log(JSON.stringify(err));
//       showErr(err)
//     }
//   }
//   ajaxMethod(options)
// }

// 新增任务
function addTask(options) {
  var options = Object.assign({}, options, {
      url: requestUrl + 'InspectionTaskService/InsertTask',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  ajaxMethod(options);
}

// function addTask(path,data,showRet,showErr) {
//   var options = {
//     url: baseUrl+path,
//     data: data,
//     success:function(ret){
//       // console.log(JSON.stringify(ret));
//       showRet(ret)
//     },
//     error:function(err){
//       // console.log(JSON.stringify(err));
//       showErr(err)
//     }
//   }
//   ajaxMethod(options)
// }


// 获取巡检记录
function getXunList(path,data,showRet,showErr) {
  var options = {
    url: baseUrl+path,
    data: data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret)
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err)
    }
  }
  ajaxMethod(options)
}

// 获取巡检点详情
function GetPointDetails(path,data,showRet,showErr) {
  var options = {
    url: baseUrl+path,
    data: data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret)
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err)
    }
  }
  ajaxMethod(options)
}

// 新增设备巡检情况
function AppInsertDeviceInspection() {
  var options = {
    url: baseUrl+path,
    data: data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret)
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err)
    }
  }
  ajaxMethod(options)
}


// 获取区域详情
function getAreaDetails(options) {
  var options = Object.assign({}, options, {
      url: requestUrl + 'AreaService/GetGetAreaDetails',
      data: options.data,
      error: function(err) {
          console.log(JSON.stringify(err))
          if(options.fail) options.fail(err);
      }
  })
  // alert(JSON.stringify(options))
  ajaxMethod(options);
}

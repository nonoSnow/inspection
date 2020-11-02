// 我的任务

// 获取我的任务接口数据
function getTaskDataSingle(path,data,showRet,showErr){
  console.log(baseUrl+path);
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

// 获取领导任务接口数据
function getJobDataAll(){}

// 获取任务详情基础信息
function getTaskBasicInfo(path,data,showRet,showErr) {
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

// 获取任务详情（巡检点列表）
function getInspectDataList(path,data,showRet,showErr) {
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
function changeTaskStatus(path,data,showRet,showErr) {
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

// 新增任务
function addTask(path,data,showRet,showErr) {
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

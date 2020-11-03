
// get请求接口
function jobGetMethod(path,data,showRet,showErr){
  // console.log(baseUrl+path);
  var options = {
    url:baseUrl+path,
    type:"get",
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

// Post请求接口
function jobPostMethod(path,data,showRet,showErr){
  // console.log(baseUrl+path);
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
// job页面 工单页面请求 的 接口
/**
* @method {Function} postAjaxJobList 获取待接收、进行中、已完成的工单 接口调用
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxJobList(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/GetWorkOrderListApp',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

/**
* @method {Function} postAjaxJobList 待接收工单点击接收 接口调用
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxJobReceived(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/ReceiveWorkOrder',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
/**
* @method {Function} postCaliberList 获取口径等字典信息
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function getAjaxCaliberList(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/app/Dictionary/GetDictionaryByCateCode',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
// 新增工单页面
/**
* @method {Function} postAjaxAddJob 新增工单
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxAddJob(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/InsertWorkOrder',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

// 负责人页面
/**
* @method {Function} getAjaxHeadList 获取负责人列表
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function getAjaxHeadList(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/app/Information/GetOrganizationAndPersonnel',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
/**
* @method {Function} getAjaxSearchHeadList 查询负责人列表
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function getAjaxSearchHeadList(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + "api/services/app/Information/GetSelectPersonnelAsync?key="+options.scrollVal,
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

// 关闭工单页面
/**
* @method {Function} postAjaxAddJob 关闭工单
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxCloseJob(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/CloseWorkOrder',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
// 转工单页面
/**
* @method {Function} postAjaxAddJob 转派工单
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxTurnJob(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/WorkOrderTransfer',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
// 工单详情页面
/**
* @method {Function} postAjaxAddJob 工单详情页面
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxJobDetail(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/GetWorkOrderDetails',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}
// 填写工单页面
/**
* @method {Function} postAjaxWriteJob 填写工单页面
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxWriteJob(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/CompleteWorkOrder',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

// 转工单原因页面
/**
* @method {Function} postAjaxTurnJobDetail 转工单原因
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
* success 请求成功
* fail 请求失败
*/
function postAjaxTurnJobDetail(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: baseUrl + 'api/services/Inspection/WorkOrderService/AppGetWorkOrderTransferById',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

// 监听caliberList
function getCaliberList(){
  caliberList=$api.getStorage('caliberList');
  // if(!caliberList){
  //   //再次请求接口
  // }
  console.log(JSON.stringify(caliberList));
  var str="";
  for (var i = 0; i < caliberList.length; i++) {
    if(i==caliberList.length-1){
      str=str+'<li class="custom-popup-item border-none">'+caliberList[i].value+'</li>'
    }else{
      str=str+'<li class="custom-popup-item">'+caliberList[i].value+'</li>'
    }
  }
  $("#caliberList1").html(str);
  $("#caliberList2").html(str);
  $("#caliberList3").html(str);
  $("#caliberList4").html(str);
}

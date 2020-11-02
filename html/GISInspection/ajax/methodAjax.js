// 获取事件列表
function getEventList(path,data,showRet,showErr){
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
// 获取事件详情
function getEventDetail(path,data,showRet,showErr){
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
// 获取添加事件
function getEventInsert(path,data,showRet,showErr){
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
// APP根据名称模糊查询区域（也可以查询所有区域）
function getAreaListData(path,data,showRet,showErr){
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

/**
* @method {Function} changeEventStatus 修改事件状态
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
*/
function changeEventStatus(options) {
    var data = options.data;
    var options = Object.assign({}, {
        url: requestUrl + 'EventService/UpdateEventById',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            if(options.fail) options.fail(err);
        }
    }, options)
    ajaxMethod(options);
}

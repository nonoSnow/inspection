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

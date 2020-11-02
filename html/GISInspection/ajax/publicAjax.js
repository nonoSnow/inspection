// 上传图片
function upLoadPicture(path,data,showRet,showErr){
  // console.log(baseUrl+path);
  var options = {
    url: baseUrl+path,
    files: data,
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

// 获取片区列表
function getAreaListData(path, data, showRet, showErr) {
  var options = {
    url: baseUrl+path,
    files: data,
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

// 上传定位
function insertLocation(path, data, showRet, showErr) {
  var options = {
    url: baseUrl+path,
    files: data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret);
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err);
    }
  }
  ajaxMethod(options)
}

// 获取当前用户角色
function getUserRoles(path, data, showRet, showErr) {
  var options = {
    url: baseUrl+path,
    files: data,
    success:function(ret){
      // console.log(JSON.stringify(ret));
      showRet(ret);
    },
    error:function(err){
      // console.log(JSON.stringify(err));
      showErr(err);
    }
  }
  ajaxMethod(options)
}

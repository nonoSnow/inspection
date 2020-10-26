// 上传图片
function upLoadPicture(path,data,showRet,showErr){
  console.log(baseUrl+path);
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


// 获取我的工单接口数据
function getJobDataSingle(path,data,showRet,showErr){
  console.log(baseUrl+path);
  var options = {
    url:baseUrl+path,
    data:data,
    success:function(ret){
      console.log(JSON.stringify(ret));
      showRet(ret)
    },
    error:function(err){
      console.log(JSON.stringify(err));
      showErr(err)
    }
  }
  ajaxMethod(options)
}
// 获取领导工单接口数据
function getJobDataAll(){}

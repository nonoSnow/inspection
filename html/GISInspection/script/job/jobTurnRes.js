
var Id;         //工单ID
var imgList=[]; //图片列表
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  Id = parseInt(api.pageParam.Id);
  // 初始化数据
  showData();
}

// 显示数据和照片
function showData() {
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '加载中...',
      modal: false
  });
  var data={
    id:Id
  }
  console.log(Id);
  // 请求数据，渲染页面
  jobPostMethod("api/services/Inspection/WorkOrderService/AppGetWorkOrderTransferById",data,showRet,showErr);

  function showRet(ret) {
    api.hideProgress();

    console.log(JSON.stringify(ret));
    if(ret.length>0){
      imgList.push(ret[0]);
      $("#transferReason").val(ret[0].transferReason);
      imgList=ret[0].resourcelist;
      showImg(imgList);
    }
  }

  function showErr(err){
    api.hideProgress();

    console.log(JSON.stringify(err));
    if(err.body){
      if(err.body.error){
        if(err.body.error.message){
          alert(err.body.error.message)
        }else {
          alert("加载失败")
        }
      }else {
        alert("加载失败")
      }
    }else {
      alert("加载失败");
    }
  }
}
// 显示图片
function showImg(data) {
  console.log(JSON.stringify(data));
  var param = {
    list: data,
    url: baseUrl
  }
  $('#imgBox').html('');
  var str = template('imgData', param);
  console.log(str);
  $('#imgBox').append(str);
  // $('#imgBox').prepend(str);
}

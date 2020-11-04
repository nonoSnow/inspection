
var imgList = []; //图片列表
var Id; //工单ID
var jobType; //工单传过来的值
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  //获取工单ID
  Id = parseInt(api.pageParam.Id);
  jobType=api.pageParam.jobType;
  // console.log(Id);
  // 初始化图片列表
  showImg(imgList);
}

// 提交关闭工单
function subJobClose(){
  // 判断关闭原因
  if(!$("#closeReason").val()){
    api.toast({
        msg: '请填写说明原因!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  var data={
    Id:Id,
    closeReason:$("#closeReason").val(),
    resourceInfoList:imgList
  }
  // console.log(JSON.stringify(data));
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '提交中...',
      modal: false
  });
  var options={
    data:data,
    success:showRet,
    error:showErr,
  }
  // 请求接口 获取数据
  postAjaxCloseJob(options);
  // jobPostMethod("api/services/Inspection/WorkOrderService/CloseWorkOrder",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    // console.log(JSON.stringify(ret));
    if(ret.success){
      api.toast({
          msg: '关闭工单成功',
          duration: 2000,
          location: 'middle'
      });
      // 清空数据
      clearData();
      if(api.pageParam.from=="jobDetail"){
        api.closeWin({
            name: 'jobDetail'
        });

      }
      api.closeWin();

    }else {
      alert("关闭工单失败")
    }
  }

  function showErr(err){
    api.hideProgress();
    // console.log(JSON.stringify(err));
    if(err.body){
      if(err.body.error){
        api.alert({
            title: '提示',
            msg: err.body.error.message,
        });
      }else{
        alert(err.body)
      }
    }else {
      alert("加载失败")
    }
  }
}

// 清空数据
function clearData(){
  $("#closeReason").val();
  imgList=[];
  showImg(imgList);
  // api.openWin({
  //     name: 'job',
  //     url: './job.html',
  //     reload:true
  // });
  api.sendEvent({
      name: 'initJob',
      extra: {
          funcName: jobType,
      }
  });
  // onBack();
  api.openWin()
}
// 上传附件 图片
// 点击拍照div弹出底部选择框，选择相册或者拍照
function action() {
  api.actionSheet({
      buttons: ['拍照', '相册选择']
  }, function(ret, err) {
    // console.log(JSON.stringify(ret));
    // console.log(JSON.stringify(err));
    if (ret.buttonIndex == 1) {
      // 选择了拍照
      var type = 'camera';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        // console.log(JSON.stringify(ret));
        if(ret.length>0){
          imgList.push(ret[0]);
          showImg(imgList);
        }
      }

      function showErr(err) {
        // console.log(JSON.stringify(err));
      }
    } else if (ret.buttonIndex == 2) {
      // 选择了从相册选择
      var type = 'album';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        // console.log(JSON.stringify(ret));

        if(ret.length>0){
          imgList.push(ret[0]);
          // console.log(JSON.stringify(imgList));
          showImg(imgList);
        }
      }

      function showErr(err) {
        // console.log(JSON.stringify(err));
      }
    }
  })
}
// 显示图片
function showImg(data) {
  // console.log(JSON.stringify(data));
  var param = {
    list: data,
    url: baseUrl
  }
  $('#imgBox').html('');
  var str = template('imgData', param);
  // console.log(str);
  $('#imgBox').append(str);
  // $('#imgBox').prepend(str);
}
// 删除图片
function deleteImg(that) {
  if (that != null) {
    var e = e || window.event;
    e.stopPropagation();

    var imgIndex = $(that).attr('parse');
    imgList = deleteArray(imgList, imgIndex);
    showImg(imgList);
  }
}

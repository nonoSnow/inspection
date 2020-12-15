
var Id;         //工单ID
var headList;   //负责人
var imgList=[]; //图片列表
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  Id = api.pageParam.Id;
  // 监听负责人的选择
  api.addEventListener({
      name: 'headList'
  }, function(ret, err) {
      // api.closeWin({name:'headList'})
      // 获取选中的负责人信息
      headList = JSON.parse(ret.value.checkHeadObj);
      $('#transferPerson').val(headList.name);
  });

  // 初始化图片列表
  showImg(imgList);
}

// 选择负责人
function onOpenHead() {
  var userLoginInformation = $api.getStorage('userLoginInformation');
  var personInfo = {
    userName: userLoginInformation.currentUserInfo.userInfo.trueName,
    userId: userLoginInformation.currentUserInfo.userInfo.userId
  }
  api.openWin({
      name: 'headList',
      url: './headList.html',
      pageParam: {
        type: 'transOrder',
        personInfo: personInfo
      }
  });
}

// 提交转派
function subTurn(){
  // 先判断条件
  // 说明原因必填
  if(!$("#transferReason").val()){
    api.toast({
        msg: '请填写说明原因!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断负责人是否填写
  if(!$("#transferPerson").val()){
    api.toast({
        msg: '请选择负责人!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 开始上传数据
  var data = {
    Id:Id,                                //工单ID
    transferPersonId:headList.userId,             //转派后的负责人ID
    transferPerson:$("#transferPerson").val(),       //转派后的负责人
    transferReason:$("#transferReason").val(),    //转派原因
    resourceInfoList:imgList                    //附件
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
  postAjaxTurnJob(options);
  // jobPostMethod("api/services/Inspection/WorkOrderService/WorkOrderTransfer",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    // console.log(JSON.stringify(ret));
    if(ret.success){
      // api.toast({
      //     msg: '转派工单成功',
      //     duration: 2000,
      //     location: 'middle'
      // });
      api.alert({
          title: '提示',
          msg: '转派工单成功',
      }, function(ret, err) {
          api.sendEvent({
              name: 'initJob',
              extra: {
                  funcName: 1,
              }
          });
          api.closeWin({
              name: 'jobDetail'
          });
          api.closeWin();
          // api.closeToWin({
          //     name: 'job'
          // });
          // api.openWin({
          //     name: 'job',
          //     url: './job.html'
          // });

      });
      // 清空数据
      clearData();
    }else {
      alert("转派工单失败")
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
  $("#transferReason").val("");
  headList={};
  imgList=[];
  showImg(imgList);
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

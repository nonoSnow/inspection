var methodType; // 事件类型
var abnormalType; //异常类型
var waterLoss; //预估损失水量
var taskId; //任务id
var deviceId; //设备id
var content; //内容
var imgList=[]; //图片列表
var pageParam = {}; // 设备点信息

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    // 跳转页面访问的数据
    pageParam = api.pageParam.data
    console.log(pageParam);


    if (pageParam) {
        alert(JSON.stringify(pageParam))
        // // 获取设备id
        // deviceId = parseInt(pageParam.id)
        // // 获取任务id
        // taskId = parseInt(pageParam.taskId)
        pageParam.location = '104.123456, 39.123456'
        $(".icon-open-area").hide();

        $("input[name=address]").val(pageParam.address)
        $("input[name=location]").val("104.123456, 39.123456")

    }

    // 点击选择事件类型
    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        // alert($(this).text())
        $('#methodType').val($(this).text());
        $('#methodType').data("type", $(this).data("value"))
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });
    // 点击选择异常类型
    $(".abnormal-type-list label").each(function() {
      $(this).click(function() {
          // alert($(this).text())
          // $('#abnormalType').val($(this).text());
          $('.custom-popup-item').removeClass('color-598');
          $(this).addClass('color-598');
      });
    });
    // 初始化图片列表
    showImg(imgList);
}
var popup = new auiPopup();
// 点击确定保存异常类型的值
function saveCheck (){
  var chk_value = [];
  $('input[name="checkbox"]:checked').each(function(){ //遍历，将所有选中的值放到数组中
      var res = $(this).val();
      chk_value.push(res)
  });
  console.log(chk_value.length==0 ?'你还没有选择任何内容！':chk_value);
  $("#abnormalType").val(chk_value.join(','));
  onHideAbnormalTypPopup();
}
// 关闭事件类型弹窗
function onHidePopup(){
    popup.hide(document.getElementById("methodTypePop"));
}
// 关闭异常类型弹窗
function onHideAbnormalTypPopup(){
    popup.hide(document.getElementById("abnormalTypePop"));
}

// 点击提交时的判断
function onSubmit(){
  // 判断事件类型是否填写
  if(!$("#methodType").val()){
    api.toast({
        msg: '请选择事件类型!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断异常类型是否填写
  if(!$("#abnormalType").val()){
    api.toast({
        msg: '请选择异常类型!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断预估损失水量是否填写
  if(!$("#waterLoss").val()){
    api.toast({
        msg: '请输入预估损失水量!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断设备点坐标是否填写
  // if(!$("#point").val()){
  //   api.toast({
  //       msg: '请选择设备点坐标!',
  //       duration: 2000,
  //       location: 'middle'
  //   });
  //   return false;
  // }
  // 判断设备地址是否填写
  // if(!$("#address").val()){
  //   api.toast({
  //       msg: '请选择设备地址!',
  //       duration: 2000,
  //       location: 'middle'
  //   });
  //   return false;
  // }
  // 判断巡检内容是否填写
  if(!$("#content").val()){
    api.toast({
        msg: '请输入巡检内容!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }

  var data = {
    type:$("#methodType").data("type"),
    errorType: $("#abnormalType").val(),
    taskId: pageParam.taskId,
    deviceId: pageParam.id,
    waterLoss: $("#waterLoss").val(),
    content: $("#content").val(),
    resourceInfoList:imgList
  }
  savaData(data)
}

// 提交保存数据
function savaData(data) {
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '数据提交中,请耐心等待...',
      modal: false
  });

  getEventInsert("api/services/Inspection/EventService/InsertEvent",data,showRet,showErr);

  function showRet(ret){
    api.hideProgress();
    if(ret.success){
      api.toast({
          msg: '添加事件成功',
          duration: 2000,
          location: 'middle'
      });
      // 清空数据
      clearData();
    }else {
      alert("添加事件失败")
    }
  }
  function showErr(err){
    api.hideProgress();
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("加载失败")
    }
  }
}
// 清空数据
function clearData(){
  $("#methodType").val("");
  $("#methodType").removeAttr("type")
  $('#abnormalType').val("");
  $("#waterLoss").val("");
  $("#point").val("");
  $("#address").val("");
  $("#content").val("");
  imgList=[];
  showImg(imgList);
}

// 点击坐标跳转到设备点列表选择页面
function onOpenArea(type) {
  api.openWin({
      // name: 'pointCoordinates',
      // url: './pointCoordinates.html',
      name: 'area',
      url: '../Area/area.html',
      pageParam: {
          type: type
      }
  });

}
// 点击拍照弹出选择框，拍照或相册选择
function uploadPhoto() {
  api.actionSheet({
      buttons: ['拍照', '相册选择']
  }, function(ret, err) {
      var type = 'album'
      if(ret.buttonIndex == 1) {
          type = 'camera'
      }
      getPicture(type, showRet, showErr);
      function showRet(ret) {
        alert(JSON.stringify(ret));
        imgList.push(ret[0]);
        showImg(imgList);
      }
      function showErr(err) {
        console.log(JSON.stringify(err));
      }
    // if (ret.buttonIndex == 1) {
    //   // 选择了拍照
    //   var type = 'camera';
    //   getPicture(type, showRet, showErr);
    //
    //   function showRet(ret) {
    //     // console.log(JSON.stringify(ret));
    //     imgList.push(ret);
    //     showImg(imgList);
    //   }
    // //
    //   function showErr(err) {
    //     console.log(JSON.stringify(err));
    //   }
    //
    //   // showImg(imgList);
    // } else if (ret.buttonIndex == 2) {
    //   // 选择了从相册选择
    //   var type = 'album';
    //   getPicture(type, showRet, showErr);
    //   function showRet(ret) {
    //     // console.log(JSON.stringify(ret));
    //     imgList.push(ret[0]);
    //     showImg(imgList);
    //   }
    //
    //   function showErr(err) {
    //     console.log(JSON.stringify(err));
    //   }
    // }
  })
}
// 显示图片
function showImg(data) {
  var param = {
    list: data,
    url: baseUrl
  }
  $('#uploadPhotos').html('');
  var str = template('imgData', param);
  console.log(str);
  $('#uploadPhotos').append(str);
}
// 删除图片
function deleteImg(that) {
  if (that != null) {
    var imgIndex = $(that).attr('parse');
    imgList = deleteArray(imgList, imgIndex);
    showImg(imgList);
  }
}

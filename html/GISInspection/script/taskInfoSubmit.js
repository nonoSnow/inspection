
var isAbnormal = true;  // 是否异常
var isLeader = false;  // 是否是领导
var details;
var imgList = [];

// 设备详情
var deviceInfo = {};

// 是否有数据
var hasRet = false;

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  // console.log(JSON.stringify(api.pageParam.data));
  details = api.pageParam.data;
  details.type = api.pageParam.type;
  // console.log(JSON.stringify(details));
  // alert(typeof(details));
  // alert(details);
  // alert(details.status);
  // console.log(details.status);
  if (details.status == 2) {
    isAbnormal = false;
  } else if (details.status == 3) {
    isAbnormal = true;
  }

  initDevInfo();
  // showImg(imgList);
  // onPageInit();

  // 是否为领导
  if (getCurrentUserRoles() == 1) {
    isLeader = true;
  } else {
    isLeader = false;
  }
}

// 初始化页面
function onPageInit() {
  // console.log(api.pageParam.type);
  if (api.pageParam.type == 'handle') {
    $('.detail').addClass("aui-hide");
    $('.abnormal').addClass("aui-hide");

    $("#fotDetail").addClass("aui-hide");
    $("#fotLeader").addClass("aui-hide");
  } else {
    // console.log(isAbnormal);
    if (isAbnormal) {
      $('.abnormal').removeClass("aui-hide");
    } else {
      $('.abnormal').addClass("aui-hide");
    }

    if (isLeader) {
      $(".detail").removeClass("aui-hide");

      $("#fotDetail").addClass("aui-hide");
      $("#fotSubmit").addClass("aui-hide");
    } else {
      $(".leader").addClass("aui-hide");

      $("#fotSubmit").addClass("aui-hide");
      $("#fotLeader").addClass("aui-hide");
    }
  }
}

// 展示附件
function showImg(data) {
  var param = {
    list: data,
    url: baseUrl,
    type: api.pageParam.type
  }
  $('#imgBox').html('');
  var str = template('imgData', param);
  // console.log(str);
  $('#imgBox').append(str);
}

// 初始化基础信息
function initDevInfo() {
  $('#devInfo').html('');

  var data = {
    deviceId: details.id,
    taskId: details.taskId,
    status: details.status,
    inspectionStatus: details.inspectionStatus
  }

  // console.log(JSON.stringify(data));

  GetPointDetails('api/services/Inspection/InspectionTaskService/GetPointDetails', data, showRet, showErr);;

  function showRet(ret) {
    console.log(JSON.stringify(ret));

    if (ret.result != null) {
      hasRet = true;
      $('#devInfo').removeClass('aui-hide');
      $('#devInfoBox').removeClass('aui-hide');
      $('#haveNothing').addClass('aui-hide');

      if (ret.result.time != null || ret.result.time != '') {
        // ret.result.time = parseTime(ret.result.time, '{y}-{m}-{d} {h}:{i}');
        ret.result.time = moment(ret.result.time).format('YYYY-MM-DD HH:mm');
      }

      deviceInfo = ret.result;

      // 基础信息
      var str = template('devBasicInfo', ret.result);
      $('#devInfo').append(str);

      // 巡检信息
      ret.result.type = details.type;
      var str1 = template('devceInfo', ret.result);
      $('#devInfoBox').append(str1);

      showImg(ret.result.resourceList);
    } else {
      $('#devInfo').addClass('aui-hide');
      $('#devInfoBox').addClass('aui-hide');
      $('#haveNothing').removeClass('aui-hide');
      api.toast({
          msg: '查询内容为空',
          duration: 2000,
          location: 'middle'
      });
    }

    onPageInit();
  }

  function showErr(err) {
    hasRet = false;
    if(err.body.error != undefined){
      // alert(err.body.error.message);
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }

  // var str = template('devBasicInfo', details);
  // $('#devInfo').append(str);
}

// 初始化设备信息
// function initDevInfo() {
//   $('#devInfoBox').html('');
//
//   var str = template('devceInfo', details);
//   $('#devInfoBox').append(str);
// }

// 巡检记录
function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test',
          devInfo: details
      }
  });
}

// 转工单
function onTransferJob() {
  console.log(JSON.stringify(deviceInfo));
  var userLoginInformation = $api.getStorage('userLoginInformation');
  var personInfo = {
    userName: userLoginInformation.currentUserInfo.userInfo.trueName,
    userId: userLoginInformation.currentUserInfo.userInfo.userId
  }
  api.openWin({
      name: 'addJob',
      url: '../Job/addJob.html',
      pageParam: {
          name: 'test',
          deviceInfo: deviceInfo,
          areaId: details.areaId,
          type: 'taskTransOrder',
          personInfo: personInfo
      }
  });

  // var dialog = new auiDialog({});
  // dialog.alert({
  //     title:"弹出提示",
  //     buttons:['取消','确定']
  // },function(ret){
  //     console.log(JSON.stringify(ret));
  //     if (ret.buttonIndex == '2') {
  //       api.openWin({
  //           name: 'addJob',
  //           url: '../Job/addJob.html',
  //           pageParam: {
  //               name: 'test'
  //           }
  //       });
  //
  //     }
  // })
}

// 上传附件
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
        imgList.push(ret[0]);
        // console.log(JSON.stringify(imgList));
        showImg(imgList);
      }

      function showErr(err) {
        // console.log(JSON.stringify(err));
        // showImg(imgList);
        if(err.body.error != undefined){
          // alert(err.body.error.message);
          api.toast({
              msg: err.body.error.message,
              duration: 2000,
              location: 'middle'
          });

        }else{
          // alert(err.msg);
          api.toast({
              msg: err.msg,
              duration: 2000,
              location: 'middle'
          });
        }
      }

      // showImg(imgList);
    } else if (ret.buttonIndex == 2) {
      // 选择了从相册选择
      var type = 'album';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        // console.log(JSON.stringify(ret));
        imgList.push(ret[0]);
        // console.log(JSON.stringify(imgList));
        showImg(imgList);
      }

      function showErr(err) {
        console.log(JSON.stringify(err));
        // showImg(imgList);
        if(err.body.error != undefined){
          // alert(err.body.error.message);
          api.toast({
              msg: err.body.error.message,
              duration: 2000,
              location: 'middle'
          });

        }else{
          // alert(err.msg);
          api.toast({
              msg: err.msg,
              duration: 2000,
              location: 'middle'
          });
        }
      }
    }
  })
}

// 删除图片
function deleteImg(that) {
  var e = e || window.event;
  e.stopPropagation();
  // if (that != null) {
    var imgIndex = $(that).attr('parse');
    // console.log(imgIndex);
    imgList = deleteArray(imgList, imgIndex);
    // console.log(JSON.stringify(imgList));
    showImg(imgList);
  // }
}

// 预览
function previewImg(that) {
  // if (that != null) {
    var imgSrc = $(that).attr('parse');
    var data = [];
    data.push(imgSrc);
    previewImage(data);
  // }
}

// 点击提交,新增设备巡检情况
function submit() {
  var content = $('#content').val();

  if (content == '') {
    api.toast({
        msg: '请输入巡检内容',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }

  var userInfo = $api.getStorage('userLoginInformation');
  // console.log(JSON.stringify(userInfo.currentUserInfo.userInfo));

  var data = {
    deviceId: details.id,
    taskId: details.taskId,
    content: content,
    personId: userInfo.currentUserInfo.userInfo.userId,
    person: userInfo.currentUserInfo.userInfo.trueName,
    resourceInfoList: imgList
  }

  // console.log(JSON.stringify(data));

  AppInsertDeviceInspection('api/services/Inspection/DeviceService/AppInsertDeviceInspection' , data, showRet, showErr);

  function showRet(ret) {
    api.sendEvent({
        name: 'fromNormal'
    });

    // 提交成功，返回任务详情列表
    api.closeToWin({
      name: 'homeTaskInfo'
    });
  }

  function showErr(err) {
    if(err.body.error != undefined){
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      // alert(err.msg);
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }
}

function onOpenViewMap() {
  // 打开地图
  // var mapInfo = ret.result;
  // console.log(JSON.stringify(mapInfo));
  // console.log(JSON.stringify(details));
  // console.log(JSON.stringify(deviceInfo));
  if (hasRet) {
    var devInfo = {};
    devInfo.deviceId = deviceInfo.id;
    devInfo.deviceName = deviceInfo.name;
    devInfo.devicePoint = deviceInfo.point;
    devInfo.deviceCode = deviceInfo.code;
    devInfo.address = deviceInfo.address;

    api.openWin({
        name: 'devicemap',
        url: '../common/device.html',
        pageParam: {
            deviceInfo: devInfo
        }
     });
  } else {
    api.toast({
        msg: '没有查到设备信息',
        duration: 2000,
        location: 'middle'
    });

  }


  // getAreaDetails({
  //   data: {
  //     id: details.areaId
  //   },
  //   success: function(ret) {
  //     // console.log(JSON.stringify(ret));
  //     var mapInfo = ret.result;
  //     console.log(JSON.stringify(mapInfo));
  //     console.log(JSON.stringify(details));
  //     console.log(JSON.stringify(deviceInfo));
  //     var devInfo = {};
  //     devInfo.deviceId = deviceInfo.id;
  //     devInfo.deviceName = deviceInfo.name;
  //     devInfo.devicePoint = deviceInfo.point;
  //     devInfo.deviceCode = deviceInfo.code;
  //     devInfo.address = deviceInfo.address;
  //     // api.openWin({
  //     //     name: 'viewMap',
  //     //     url: '../task/viewMap.html',
  //     //     pageParam: {
  //     //       mapInfo: mapInfo
  //     //     }
  //     // });
  //     api.openWin({
  //         name: 'devicemap',
  //         url: '../common/device.html',
  //         pageParam: {
  //             deviceInfo: devInfo
  //         }
  //      });
  //   }
  // })
}

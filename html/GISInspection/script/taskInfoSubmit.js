
var isAbnormal = true;  // 是否异常
var isLeader = false;  // 是否是领导
var details;
var imgList = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  console.log(JSON.stringify(api.pageParam.data));
  details = api.pageParam.data;
  details.type = api.pageParam.type;

  // alert(typeof(details));
  // alert(details);
  // alert(details.status);
  console.log(details.status);
  if (details.status == 2) {
    isAbnormal = false;
  } else if (details.status == 3) {
    isAbnormal = true;
  }

  initDevBasicInfo();
  initDevInfo();
  showImg(imgList);
  onPageInit();
}

// 初始化页面
function onPageInit() {
  console.log(api.pageParam.type);
  if (api.pageParam.type == 'handle') {
    $('.detail').addClass("aui-hide");
    $('.abnormal').addClass("aui-hide");

    $("#fotDetail").addClass("aui-hide");
    $("#fotLeader").addClass("aui-hide");
  } else {
    console.log(isAbnormal);
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
  console.log(str);
  $('#imgBox').append(str);
}

// 初始化基础信息
function initDevBasicInfo() {
  $('#devInfo').html('');

  var str = template('devBasicInfo', details);
  $('#devInfo').append(str);
}

// 初始化设备信息
function initDevInfo() {
  $('#devInfoBox').html('');

  var str = template('devceInfo', details);
  $('#devInfoBox').append(str);
}

// 巡检记录
function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test'
      }
  });
}

// 转工单
function onTransferJob() {
  var dialog = new auiDialog({});
  dialog.alert({
      title:"弹出提示",
      buttons:['取消','确定']
  },function(ret){
      console.log(JSON.stringify(ret));
      if (ret.buttonIndex == '2') {
        api.openWin({
            name: 'addJob',
            url: '../Job/addJob.html',
            pageParam: {
                name: 'test'
            }
        });

      }
  })
}

// 上传附件
function action() {
  api.actionSheet({
      buttons: ['拍照', '相册选择']
  }, function(ret, err) {
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(err));
    if (ret.buttonIndex == 1) {
      // 选择了拍照
      var type = 'camera';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        console.log(JSON.stringify(ret));
        imgList.push(ret);
        showImg(imgList);
      }

      function showErr(err) {
        console.log(JSON.stringify(err));
        // showImg(imgList);
      }

      // showImg(imgList);
    } else if (ret.buttonIndex == 2) {
      // 选择了从相册选择
      var type = 'album';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        console.log(JSON.stringify(ret));
        imgList.push(ret[0]);
        console.log(JSON.stringify(imgList));
        showImg(imgList);
      }

      function showErr(err) {
        console.log(JSON.stringify(err));
        // showImg(imgList);
      }
    }
  })
}

// 删除图片
function deleteImg(that) {
  if (that != null) {
    var imgIndex = $(that).attr('parse');
    console.log(imgIndex);
    imgList = deleteArray(imgList, imgIndex);
    console.log(JSON.stringify(imgList));
    showImg(imgList);
  }
}

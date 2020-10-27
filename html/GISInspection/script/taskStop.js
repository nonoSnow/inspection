// 任务详情
var details;
// 是否可以提交
var submitFlag = false;
// 原因
var remark = '';

var imgList = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  details = api.pageParam.data;

  setDetails(details);

  var resonBox = document.getElementById('suspendedResonBox');
  // var el = document.getElementById('customerMessage');
  resonBox.addEventListener('input', function () {
    console.log(this.value);
    remark = this.value;
    // 如果有说明原因，则可提交否则不能提交
    if (this.value.length != 0) {
      $('.footer-btn').removeClass('btn-disabled');
      submitFlag = true;
    } else {
      $('.footer-btn').addClass('btn-disabled');
      submitFlag = false;
    }
  });


  showImg(imgList);
}

// 任务详情信息填充
function setDetails(data) {
  $('#taskDetail').html();
  var str = template('taskDetails', data);
  $('#taskDetail').append(str);
}

// 提交原因暂停
function submitReson() {
  console.log(submitFlag);
  if (submitFlag) {
    console.log('有原因，可以提交');

  }
}

// 点击拍照div弹出底部选择框，选择相册或者拍照
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


function showImg(data) {
  // console.log('初始化图片框');
  // $('#imgBox').html('<div class="margin-top75 file-div relative" tapmode onclick="action()">' +
  //   '<div class="file-img absolute top06 left15">' +
  //   '<img src="../../image/camera.png" class="camera-img" alt="">' +
  //   '</div>' +
  //   '<div class="absolute top21 text-cent file-text width100">' +
  //     '上传照片' +
  //   '</div>' +
  // '</div>');
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

// 暂停任务
function suspendedTask() {
  var data = {
    id: taskId,
    reason: remark,
    operate: 1,
    resourceInfoList: imgList
  }

  changeTaskStatus('api/services/Inspection/InspectionTask/UpdateTaskStatus', data, showRet, showErr);

  function showRet(ret) {
    console.log(JSON.stringify(ret));
  }

  function showErr(err) {
    if(err.code == 1){
      alert(err.body.error.message)
    }else if(err.code == 0){
      alert(err.msg);
    }
  }
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

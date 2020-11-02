
var pageType = userId = '';
var userDetail;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  // 页面类型  1 - 申请   2 - 管理
  if (api.pageParam.type == '1') {
    $(".come-time").addClass('aui-hide');
    $(".leave").addClass('aui-hide');
  } else {
    $(".refuse").addClass('aui-hide');
    $(".pass").addClass('aui-hide');
  }

  userId = api.pageParam.userId;

  onGetUserDetail(userId);

}

function onGetUserDetail(userId) {
  var body = {
    id: userId
  };
  fnPost("services/Security/VisitRecordService/GetById", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      var userDetail = ret.result;
      Object.keys(userDetail).forEach(function(key){
        $("." + key).text(userDetail[key]);
        // 照片
        if (key == 'idCardPhoto') {
          $(".idCardPhoto").attr('src', userDetail[key]);
        }

        // 证件类型
        if (key == 'idCardType') {
          if (userDetail[key] == '0') {
            $(".idCardType").text('身份证');
          } else if (userDetail[key] == '1') {
            $(".idCardType").text('军官证');
          } else if (userDetail[key] == '2') {
           $(".idCardType").text('护照');
         }
        }

      });
    }
  });
}

function onPassRefuse(type) {
  var body = {
      id: userId,
      checkStatus: type
  };
  fnPost("services/Security/VisitRecordService/DeleteRecord", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      api.toast({
          msg: "审核成功",
          duration: 2000,
          location: 'middle'
      });
      api.sendEvent({
          name: 'refresh',
      });

      api.closeWin({});
    }
  });
}

function onLeave() {
  var body = {
      id: userId,
      leaveTime: onGetNowTime()
  };
  fnPost("services/Security/VisitRecordService/InsertLeaveTime", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      api.toast({
          msg: "提交成功",
          duration: 2000,
          location: 'middle'
      });
      api.sendEvent({
          name: 'refresh',
      });

      api.closeWin({});
    }
  });
}

function onGetNowTime() {
  var myDate = new Date();
  return myDate.getFullYear() + "-" + twoDigits(myDate.getMonth() + 1) + "-" + twoDigits(myDate.getDate()) + " " + twoDigits(myDate.getHours()) + ":" + twoDigits(myDate.getMinutes()) + ":" + twoDigits(myDate.getSeconds());
}

function twoDigits(val) {
    if (val < 10) return "0" + val;
    return val;
}

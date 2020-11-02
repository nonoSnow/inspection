
var pageType = '', orgId = '';

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  // 页面类型  1 - 申请   2 - 管理
  pageType = api.pageParam.type;

  orgId = $api.getStorage('userLoginInformation').currentUserInfo.userInfo.orgId;

  onGetList();

  api.addEventListener({
      name: 'refresh'
  }, function(ret, err){
      onGetList();
  });

}

var startRoll = new Rolldate({
  el: '#start-time',
  format: 'YYYY-MM-DD hh:mm',
  beginYear: 2000,
  endYear: 2100
});

var endRoll =new Rolldate({
  el: '#end-time',
  format: 'YYYY-MM-DD hh:mm',
  beginYear: 2000,
  endYear: 2100
});

var nowType = '';
function onSelectTime(type) {
  if (nowType == '') {
    nowType = type;
  } else {
    if (nowType != type) {
      startRoll.hide();
      endRoll.hide();
      nowType = type;
      if (type == '1') {
        setTimeout(function () {
          startRoll.show();
        }, 100);
      } else {
        setTimeout(function () {
          endRoll.show();
        }, 100);
      }
    }
  }

}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("screenPop"));
}

function onHideDialogDom() {
    popup.hide(document.getElementById("dialogDom"));
}

function onGetSearchVal() {
  var searchVal = $("#search-input").val();
  if (searchVal != '' && searchVal != ' ') {
    $('.search-btn').removeClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'inline-block');
  } else {
    $('.search-btn').addClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'none');
  }
}

function onEmpty() {
  $("#search-input").val('');
  onGetSearchVal();
}

function onReset() {
  $("#start-time").val('');
  $("#end-time").val('');
}

function onResetSearch() {
  $("#search-input").val('');
  $("#start-time").val('');
  $("#end-time").val('');
}

function onGetList() {
  onHidePopup();
  var body = {
    nameOrTel: $("#search-input").val(),
    visitTimeBegin: $("#start-time").val(),
    visitTimeEnd: $("#end-time").val(),
    roles: [orgId],
    codes: [''],
    pageIndex: 1,
    maxResultCount: 1000

  };
  var userListData = [];
  if (pageType == '1') {
    fnPost("services/Security/VisitRecordService/GetApplyList", body, "application/json", true, false, function(ret, err){
      api.hideProgress();
      if (ret || ret.success) {
        userListData = ret.result;
      }
    });

  } else if (pageType == '2') {
    fnPost("services/Security/VisitRecordService/GetPageList", body, "application/json", true, false, function(ret, err){
      api.hideProgress();
      if (ret || ret.success) {
        userListData = ret.result.items;

        var datas = {
            datas: userListData
        }
        if (pageType == '1') {
          var str = template('applyUserList', datas);
        } else {
          var str = template('manageUserList', datas);
        }

        $('#list').empty();
        $('#list').append(str);
      }
    });
  }

}

function onOpenDetail(item) {
  api.openWin({
      name: 'userDetail',
      url: './userDetail.html',
      pageParam: {
          type: pageType,
          userId: item.id
      }
  });
}

var checkItem = {}, checkType = '';
function onOpenDialog(item, type) {
  var e = e || window.event;
  e.stopPropagation();
  checkItem = item;
  checkType = type;
  var message = "";
  if (type == '1') {
    message = "您确定该访客申请通过吗？";
  } else if (type == '2') {
    message = "您确定拒绝该访客申请吗？";
  } else if (type == '3') {
    message = "您确定要删除该访客申请吗？";
  } else if (type == '4') {
    message = "您确定该访客已离开？";
  }
  $(".dialogText").text(message);
  popup.show(document.getElementById("dialogDom"));
}

function onDialogOk() {
  if (checkType == '1') {
    onPassRefuse(1);
  } else if (checkType == '2') {
    onPassRefuse(0);
  } else if (checkType == '3') {
    onDelete();
  } else if (checkType == '4') {
    onLeave();
  }
  onHideDialogDom();
}

function onPassRefuse(type) {
  var body = {
      id: checkItem.id,
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
      onResetSearch();
      onGetList();
    }
  });
}

function onDelete() {
  fnPost("services/Security/VisitRecordService/DeleteRecord", [checkItem.id], "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      api.toast({
          msg: "删除成功",
          duration: 2000,
          location: 'middle'
      });
      onResetSearch();
      onGetList();
    }
  });
}

function onLeave() {
  var body = {
      id: checkItem.id,
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
      onResetSearch();
      onGetList();
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

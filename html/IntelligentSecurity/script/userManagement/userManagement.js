apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  api.setStatusBarStyle({
    style: 'dark',
    color:'transparent'
  });

  onGetManageData();
}

function onGetManageData() {
    var orgId= $api.getStorage('userLoginInformation').currentUserInfo.userInfo.orgId;
    var body = {
      OneDay: '',
      Roles: [orgId]
    };
    fnPost("services/Security/VisitRecordService/GetOnedayRecord", body, "application/json", true, false, function(ret, err){
      api.hideProgress();
      console.log(JSON.stringify(ret));
      console.log(JSON.stringify(err));
      if (ret && ret.success) {
        $(".comeNum").text(ret.result.visitorCount);
        $(".leaveNum").text(ret.result.notLeaveCount);
      }
    });
}

function onOpenList(type) {
  api.openWin({
      name: 'userList',
      url: './userList.html',
      pageParam: {
          type: type
      }
  });

}

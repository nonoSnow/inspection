
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  onGetSelectData();
}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("userCarPop"));
}

function onGetSelectData() {
  var orgId= $api.getStorage('userLoginInformation').currentUserInfo.userInfo.orgId;
  var body = {
      OrgId: orgId
  };
  fnPost("services/Security/CarService/GetByOrgId", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(err));
  });
}

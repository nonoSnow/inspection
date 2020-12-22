
// 选中的 设备 - 管道
var checkArr = checkEquipmentArr = checkConduitArr = [];

// 片区id
var areaId = '';
// 片区信息
var areaInfo = {};

var checkAreaInfo = {};
var checkEquipment = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  areaId = api.pageParam.areaInfo.id;
  checkAreaInfo = api.pageParam.checkAreaInfo;
  checkEquipment = api.pageParam.checkEquipment;
  onGetAreaInfo(areaId);

  if(checkAreaInfo != undefined && JSON.stringify(checkAreaInfo) != '{}') {
    if (areaId == checkAreaInfo.id) {
      onShowHtml(checkEquipment[0].type, checkEquipment);
    }
  }

  api.addEventListener({
      name: 'checkEquipment'
  }, function(ret, err){
      var type = ret.value.type;
      checkArr = ret.value.checkArr;
      for (var i = 0; i < checkArr.length; i++) {
        checkArr[i] = JSON.parse(checkArr[i]);
      }
      onShowHtml(type, checkArr);
  });

}

function onShowHtml(type, checkArr) {
  if (checkArr.length > 0) {
    $(".footer-btn").removeClass('btn-disabled');
  } else {
    $(".footer-btn").addClass('btn-disabled');
  }
  if (type == 1) {
    checkEquipmentArr = checkArr;
    checkConduitArr = [];
  } else if (type == 2) {
    checkEquipmentArr = [];
    checkConduitArr = checkArr;
  }

  var dataEquipment = {
    datas: checkEquipmentArr
  };
  var str1 = template('list', dataEquipment);
  $('#equipmentList').empty();
  $('#equipmentList').append(str1);

  var datas = {
    datas: checkConduitArr
  };
  var str2 = template('list', datas);
  $('#conduitList').empty();
  $('#conduitList').append(str2);

  onShowType();
}

function onGetAreaInfo(areaId) {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var data = {
    id: areaId
  };
  var optionsInfo = {
    url: baseUrl + "api/services/Inspection/AreaService/GetGetAreaDetails",
    data: data,
    success: function(ret) {
      api.hideProgress();
      areaInfo = ret.result;
      $(".areaName").text('片区名称：' + areaInfo.name)
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsInfo);
}


function onOpenSelect(type) {
  if (JSON.stringify(areaInfo) == '{}') {
    return false;
  }
  // console.log(JSON.stringify(checkEquipment));
  api.openWin({
      name: 'equipmentSelect_new',
      url: './equipmentSelect_new.html',
      pageParam: {
          type: type,
          areaInfo: areaInfo,
          checkEquipment: checkEquipment
      }
  });

}

function onShowType() {
  if (checkEquipmentArr.length > 0) {
    $("#selectEquipment").addClass('aui-hide');
    $("#equipmentList").removeClass('aui-hide');
  } else {
    $("#selectEquipment").removeClass('aui-hide');
    $("#equipmentList").addClass('aui-hide');
  }

  if (checkConduitArr.length == 0) {
    $("#selectConduit").removeClass('aui-hide');
    $("#conduitList").addClass('aui-hide');
  } else {
    $("#selectConduit").addClass('aui-hide');
    $("#conduitList").removeClass('aui-hide');
  }
}

function onSubmit() {
  if ($(".footer-btn").hasClass('btn-disabled')) {
    return false;
  }

  api.sendEvent({
      name: 'addArea',
      extra: {
          areaInfo: areaInfo,
          equipment: checkArr
      }
  });

  api.closeToWin({
      name: 'addJob'
  });


}

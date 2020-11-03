
// 片区Id
var areaId = '';
var areaInfo = {};

// 设备点集合 - 管道设备集合
var deviceList = pipelineList = [];

// 默认数据
var checkEquipment = {};

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  areaInfo = api.pageParam.areaInfo;
  areaId = areaInfo.id;
  checkEquipment = api.pageParam.checkEquipment;

  onGetData(areaId);
}

function onMenu(index, el){
  onCheckMenu(el, function(){
    $(".equipmentItem").each(function() {
      if ($(this)[0].checked) {
        checkEquipment = JSON.parse($(this).attr('item'));
      }
    });
    onShowCheckArr(index);
  });
}

function onGetData(areaId) {
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
      deviceList = ret.result.deviceLists;
      pipelineList = ret.result.pipelineLists;

      if (JSON.stringify(checkEquipment) == '{}') {
        onShowHtml('0');
      } else {
        onShowCheckArr('');
      }
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsInfo);
}

function onShowCheckArr(index) {
  if (checkEquipment.type == 1) {
    for (var i = 0; i < deviceList.length; i++) {
      if (checkEquipment.id == deviceList[i].id) {
        deviceList[i].isCheck = true;
      } else {
        deviceList[i].isCheck = false;
      }
    }
    for (var i = 0; i < pipelineList.length; i++) {
      pipelineList[i].isCheck = false;
    }
    if (index === '') {
      index = '0';
    }
  } else if (checkEquipment.type == 2) {
    for (var i = 0; i < pipelineList.length; i++) {
      if (checkEquipment.id == pipelineList[i].id) {
        pipelineList[i].isCheck = true;
      } else {
        pipelineList[i].isCheck = false;
      }
    }
    for (var i = 0; i < deviceList.length; i++) {
      deviceList[i].isCheck = false;
    }
    if (index === '') {
      index = '1';
    }
  }
  onShowHtml(index);
}

function onShowHtml(type) {
  var datas = {};
  if (type == '0') {
    datas = {
      datas: deviceList
    };
  } else if (type == '1') {
    datas = {
      datas: pipelineList
    };
  }
  var str = template('equipmentItem', datas);
  $('#equipmentList').empty();
  $('#equipmentList').append(str);
}

function onCheck(el) {
  checkEquipment = JSON.parse($(el).attr('item'));
}

function onSave() {

  if (JSON.stringify(checkEquipment) == '{}') {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return;
  };
  api.sendEvent({
      name: 'addMethodEquipment',
      extra: {
          areaInfo: areaInfo,
          equipment: checkEquipment
      }
  });
  api.closeToWin({
      name: 'addMethodReport'
  });

}

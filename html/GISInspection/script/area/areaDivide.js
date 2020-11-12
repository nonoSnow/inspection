
var indexMap = {};

// 是否在划分模式
var isDivide = false;

var isSave = false;

var addareaPoint = [];

var drw = '';

// 选中的图层
var checkLayerArr = [];

// 选中的设备 - 管线
var checkPoint = [];
var checkLine = [];

var areaPoint = "";

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  addareaPoint = api.pageParam.addAreaPoint;
  checkLayerArr = api.pageParam.checkedArr;

  // 初始化地图
  indexMap = new Map({
      mapid: 'mapAddArea'
  });
  indexMap.initDeviceLayer('areaDivide');
  indexMap.initDivide();

  // 测试代码   设置当前地图位置
  // indexMap.map.getView().setCenter([104.15865182876587,30.02561330795288]);
  // 初始化地图定位到溧水
  indexMap.map.getView().setCenter([119.0319,31.6655]);

  if (addareaPoint.length > 0) {
    isDivide = true;
    indexMap.mapToLine(true, false, addareaPoint, drw, function(ret){
      drw = ret.measureDraw;
      isSave = ret.isSave;
    });
    $(".footer").removeClass("aui-hide");
  } else {
    onShowBtn();
  }

  // 缩放地图事件
  $(".map-scale-btn").on('click', function() {
    if($(this).hasClass('up')) {
        indexMap.changeAreaScale(1);
    } else {
        indexMap.changeAreaScale(0);
    }
  });
}

function onDivide() {
  isDivide = !isDivide;
  onShowBtn();
}

function onShowBtn() {
  if (isDivide) {
    $(".footer").removeClass("aui-hide");
    if (addareaPoint.length > 0) {
      indexMap.mapToLine(false, false, addareaPoint, drw, function(ret){
        drw = ret.measureDraw;
        isSave = ret.isSave;
      });
    } else {
      indexMap.mapToLine(true, false, addareaPoint, drw, function(ret){
        drw = ret.measureDraw;
        isSave = ret.isSave;
      });
    }
  } else {
    $(".footer").addClass("aui-hide");
    indexMap.mapToLine(false, false, addareaPoint, drw, function(ret){
      drw = ret.measureDraw;
      isSave = ret.isSave;
    });
  }
}

function onResetArea() {
    indexMap.mapRemoveInteraction(drw, addareaPoint, function(ret) {
      drw = ret.measureDraw;
      isSave = ret.isSave;
      addareaPoint = [];
    });
}

function onSaveArea() {
    if (isSave) {
      indexMap.mapSaveArea(drw, function(ret) {
        drw = ret.measureDraw;
        addareaPoint = ret.coordinates;
        isSave = false;

        var divideProint = ret.coordinates[0];
        var areaExtent = "";
        for (var i = 0; i < divideProint.length; i++) {
          areaExtent += divideProint[i][0] + "," + divideProint[i][1] + " ";
        }
        areaExtent = areaExtent.substring(0, areaExtent.length - 1);
        areaPoint = areaExtent.replace(/( )/g, ';');
        areaPoint += ";";
        onGetAreaPorintLine(areaExtent);
      });
    }
}

function onGetAreaPorintLine(areaExtent) {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  reqOptions = {
      url: gisUrl + 'SearchPipe/GetPipeByExtent',
      type: 'get',
      timeout: 30,
      data: {
          coords: areaExtent
      },
      error: function(err) {
          api.hideProgress();
          console.log(JSON.stringify(err));
      },
      success: function(ret) {
          api.hideProgress();


          onShowPoint(ret.result.point, ret.result.line);
      }
  };
  ajaxMethod(reqOptions);
}

function onShowPoint(pointArr, lineArr) {
  checkPoint = [];
  checkLine = [];
  for (var i = 0; i < pointArr.length; i++) {
    for (var j = 0; j < checkLayerArr.length; j++) {
      if (checkLayerArr[j].label == pointArr[i].pointName) {
        checkPoint.push(pointArr[i]);
        break;
      }
    }
  }

  for (var i = 0; i < lineArr.length; i++) {
    for (var j = 0; j < checkLayerArr.length; j++) {
      if (checkLayerArr[j].label == lineArr[i].material) {
        checkLine.push(lineArr[i]);
        break;
      }
    }
  }

  if (checkPoint.length == 0 && checkLine.length == 0) {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"划分区域内无设备",
        buttons:['取消','确定']
    },function(ret){

    });
    onResetArea();
    return false;
  }
  indexMap.showPointLine(checkPoint, checkLine, 'areaDivide');
}

function onSave() {
  if (checkPoint.length == 0 && checkLine.length == 0) {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return false;
  }

  api.openWin({
      name: 'addAreaEquipment',
      url: './addAreaEquipment.html',
      pageParam: {
          checkPoint: checkPoint,
          checkLine: checkLine,
          areaPoint: areaPoint
      }
  });

}

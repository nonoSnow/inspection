
var indexMap = {};

// 是否在划分模式
var isDivide = false;

var isSave = false;

var addareaPoint = [];

var drw;

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  addareaPoint = api.pageParam.addAreaPoint;

  // 初始化地图
  indexMap = new Map({
      mapid: 'mapAddArea'
  });

  if (addareaPoint.length > 0) {
    isDivide = true;
    indexMap.mapToLine(true, false, addareaPoint, function(ret){
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
    indexMap.mapToLine(true, false, addareaPoint, function(ret){
      drw = ret.measureDraw;
      isSave = ret.isSave;
    });
  } else {
    $(".footer").addClass("aui-hide");
    indexMap.mapToLine(false, false, addareaPoint, function(ret){
      drw = ret.measureDraw;
      isSave = ret.isSave;
    });
  }
}

function onResetArea() {
    indexMap.mapRemoveInteraction(drw, addareaPoint, function(ret) {
      drw = ret.measureDraw;
      isSave = ret.isSave;
    });
}

function onSaveArea() {
    if (isSave) {
      indexMap.mapSaveArea(drw, function(ret) {
        drw = ret.measureDraw;
        api.sendEvent({
            name: 'addAreaPoint',
            extra: {
                areaPoint: ret.coordinates
            }
        });
        api.closeWin({});
      });
    }
}

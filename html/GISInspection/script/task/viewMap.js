var mapInfo;

var indexMap = {};

var lineList = pointList = [];

var devFlag = false;
var lineFlag = false;
var isInitMap = false;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  // console.log('进入地图页面了！！！！！！！！！');
  mapInfo = api.pageParam.mapInfo;
  // console.log(JSON.stringify(mapInfo));
  if (mapInfo.deviceLists == undefined) {
    pointList = [];
    devFlag = true;
  } else {
    pointList = mapInfo.deviceLists;
    devFlag = true;
  }

  if (mapInfo.pipelineLists == undefined) {
    lineList = [];
    lineFlag = true;
  } else {
    lineList = mapInfo.pipelineLists;
    lineFlag = true;
  }

  console.log(lineFlag && devFlag);
  if (lineFlag && devFlag) {
    initMap();
  }

}

function initMap() {
  if ($.isEmptyObject(indexMap)) {
    indexMap = new Map({
        mapid: 'mapBox'
    });
    indexMap.initArea('addArea');
    indexMap.initDeviceLayer('addArea');
  }
  // indexMap = new Map({
  //     mapid: 'mapBox'
  // });
  indexMap.drawAreaSelect(mapInfo.areaPoint, {name: 'addArea'});
  indexMap.mapConduitEquipment({
      areaPoint: mapInfo.areaPoint,
      lineList: lineList,
      pointList: pointList
  }, {name: 'addArea'});
}

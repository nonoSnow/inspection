var mapInfo;
var indexMap = {};
var lineList = pointList = [];

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  mapInfo = api.pageParam.mapInfo;
  if (mapInfo.)


  // initMap();
}

function initMap() {
  indexMap = new Map({
      mapid: 'map-box'
  });
  indexMap.initArea('addArea');
  var areaInfo = mapInfo.areaInfo;
  indexMap.drawAreaSelect(areaInfo.areaPoint, {name: 'addArea'});
  indexMap.mapConduitEquipment({
      areaPoint: areaInfo.areaPoint,
      lineList: lineList,
      pointList: pointList
  }, {name: 'addArea'});
}

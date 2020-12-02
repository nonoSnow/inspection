
var indexMap = {};

var carInfo = {};

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerH = $("#header").height();

  // 初始化地图
  indexMap = new Map({
      mapid: 'map'
  });

  carInfo = api.pageParam.carInfo;
  onCreateCarLayer(carInfo);

  indexMap.initMapTrajectory();
}

function onCreateCarLayer(carInfo) {
  var positionArr = [];
  positionArr.push([carInfo.longitude, carInfo.latitude]);
  indexMap.addOverLayer({
      dom: '#map-member-img',
      position: positionArr,
      offset: [38.5, -43.5],
      isCenter: true,
      name: 'memberlay',
      // centerPosition: ''
  })

  indexMap.map.getView().setCenter([carInfo.longitude, carInfo.latitude]);
  indexMap['memberlay']['0'].setPosition([carInfo.longitude, carInfo.latitude]);
}

function onTimeTrajectory(type) {
  if (type == '1' || type == '2') {
    var selectTime = getTime(type);
    onGetTrajectory(selectTime);
    console.log(JSON.stringify(selectTime));
  } else if (type == '3') {

  }
}

function onGetTrajectory(selectTime) {
  var body = {
    "carId": carInfo.carId,
    "beginTime": "2020-11-20 00:00:00",// selectTime[0],
    "endTime": "2020-11-20 23:59:59",// selectTime[1],
    "pageIndex": 1,
    "skipCount": 0,
    "maxResultCount": 0
  };
  fnPost("services/Security/CarLocationService/GetAllCarTravel", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(err));
    if (ret && ret.success) {
    }
  });
}

function getTime(type) {
  var myDate = new Date();
  if (type == '1') {
    return [myDate.getFullYear() + "-" + twoDigits(myDate.getMonth() + 1) + "-" + twoDigits(myDate.getDate()) + " 00:00:00", myDate.getFullYear() + "-" + twoDigits(myDate.getMonth() + 1) + "-" + twoDigits(myDate.getDate()) + " " + twoDigits(myDate.getHours()) + ":" + twoDigits(myDate.getMinutes()) + ":" + twoDigits(myDate.getSeconds())];
  } else if (type == '2') {
    return [myDate.getFullYear() + "-" + twoDigits(myDate.getMonth() + 1) + "-" + twoDigits(myDate.getDate() - 1) + " 00:00:00", myDate.getFullYear() + "-" + twoDigits(myDate.getMonth() + 1) + "-" + twoDigits(myDate.getDate() - 1) + " 23:59:59"];
  }
}

function twoDigits(val) {
    if (val < 10) return "0" + val;
    return val;
}

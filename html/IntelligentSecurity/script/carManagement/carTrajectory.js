
var indexMap = {};

var carInfo = {};

var carOribtList = [{
    longitude: '119.014598',
    latitude: '31.595281'
}, {
    longitude: '119.015598',
    latitude: '31.595281'
}, {
    longitude: '119.015598',
    latitude: '31.596281'
}, {
    longitude: '119.016598',
    latitude: '31.597281'
}]

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerH = $("#header").height();

  // 初始化地图
  indexMap = new Map({
      mapid: 'map',
      zoom: 18
  });

  carInfo = api.pageParam.carInfo;
  onCreateCarLayer(carInfo);
  // indexMap.initMapTrajectory();

  // 初始化车辆轨迹图层
  indexMap.initLineOrbit('car');

  // 绘制车辆轨迹
  drawCarOribt(carOribtList);
}
pcAnimate();
function pcAnimate() {

    // 初始化地图
    indexMap = new Map({
        mapid: 'map',
        zoom: 18
    });

    // 初始化车辆轨迹图层
    indexMap.initLineOrbit('car');

    // 绘制车辆轨迹
    drawCarOribt(carOribtList);
}

$(".start-animate").on('click', function() {
    startJernyAmimate(2)
})

/**
* @method startJernyAmimate
* @param speed {Array}  车辆行走的速度，比如startJernyAmimate(2)  表示以两倍速度运动
* orbitList
*/
function startJernyAmimate(speed) {
    indexMap.drawCarTrajectory({
        name: 'car',
        speed: speed || 1,
        callback: function(corr_car, rotation) {
            var rotate = rotation / 3.14 * 180
            $("#map-member-img-0 img").css({
                transform: 'rotate('+ (rotate) +'deg)'
            })
            indexMap['memberlay']['0'].setPosition(corr_car);
        }
    });
}


/**
* @method drawCarOribt 绘制车辆轨迹
* @param orbitList {Array}  车辆行走途经点列表数据
* orbitList
*/
function drawCarOribt(oribtArr) {
    var coordinates = [];
    for(var i = 0; i< oribtArr.length; i++){
        coordinates.push([Number(oribtArr[i].longitude), Number(oribtArr[i].latitude)]);
    }
    indexMap.addOverLayer({
        dom: '#map-start',
        position: [coordinates[0]],
        offset: [0, -31],
        // isCenter: true,
        name: 'start',
        // centerPosition: ''
    })
    indexMap.addOverLayer({
        dom: '#map-member-img',
        position: [coordinates[0]],
        offset: [-30, -21],
        isCenter: true,
        name: 'memberlay',
        // centerPosition: ''
    })
    indexMap.addOverLayer({
        dom: '#map-end',
        position: [coordinates[coordinates.length - 1]],
        offset: [0, -31],
        // isCenter: true,
        name: 'end',
        // centerPosition: ''
    })
    indexMap.drawOribitRoute(coordinates, 'car');
}

function onCreateCarLayer(carInfo) {
  var positionArr = [];
  positionArr.push([carInfo.longitude, carInfo.latitude]);
  indexMap.addOverLayer({
      dom: '#map-member-img',
      position: positionArr,
      offset: [-30, -21],
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

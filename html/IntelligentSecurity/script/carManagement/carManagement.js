
var indexMap = {};

var carList = [];

var carTrackRrajectory = {};
//106.54257422417025,29.561628124911305
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerH = $("#header").height();

  // 初始化地图
  indexMap = new Map({
      mapid: 'map'
  });

  // 缩放地图事件
  $(".map-scale-btn").on('click', function() {
      if($(this).hasClass('up')) {
          indexMap.changeAreaScale(1);
      } else {
          indexMap.changeAreaScale(0);
      }
  });

  // 点击定位图标将员工的位置定位到屏幕中间
  $(".location-btn").on('click', function() {
      getMemberLocation(function(location) {
          console.log(location);
          indexMap.map.getView().setCenter(["119.014378", "31.595151"]);
          indexMap['memberlay']['0'].setPosition(["119.014378", "31.595151"]);
      });
  });
  getAllCar();
  // onGetCarArr();
}

function onGetCarArr() {
  // 模拟汽车数据
  // carList = [
  //   {"id": "0001", "type": "0", "carName": "渝A66666", "position": ["106.5025712070178", "29.591623152627714"]},
  //   {"id": "0002", "type": "1", "carName": "渝A88888", "position": ["106.5325712070178", "29.551623152627714"]},
  //   {"id": "0003", "type": "0", "carName": "渝A99999", "position": ["106.5325712070178", "29.501623152627714"]},
  // ];

  var datas = {
      datas: carList
  };

  var str = template('carLayer', datas);

  $(".map-member-img").remove();
  $('.flex-wrap').append(str);

  onCreateCarLayer(carList);
}

function getAllCar() {
  var body = {
    OwnOrNumber: '',
  };
  fnPost("services/Security/CarRealTimeInfoService/GetAllCars", body, "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      $(".car-all-num").text(ret.result.allCarsCount);
      $(".car-online-num").text(ret.result.onlineCount);
      $(".car-offline-num").text(ret.result.offlineCount);

      getCarList(ret.result.orgAndCarsList);
      console.log(JSON.stringify(carList));
      onGetCarArr();
    }
  });
}

function getCarList(orgAndCarsList) {
  // var carArr = [];
  for (let i = 0; i < orgAndCarsList.length; i++) {
    if (orgAndCarsList[i].carsInfo.length > 0) {
      var carsInfo = orgAndCarsList[i].carsInfo;
      for (let j = 0; j < carsInfo.length; j++) {
        carList.push(carsInfo[j]);
      }
    }
    if (orgAndCarsList[i].childs.length > 0) {
      if (carList.length > 0) {
        getCarList(orgAndCarsList[i].childs);
      }
    }
  }
  // return
}

function onHideItem() {
  $(".map-footer").addClass("aui-hide");
  carTrackRrajectory = {};
}

function onCreateCarLayer(carArr) {
  var positionArr = [];
  for (var i = 0; i < carArr.length; i++) {
    positionArr.push([carArr[i].longitude, carArr[i].latitude]);
    // positionArr.push(carArr[i].position);
  }
  console.log(JSON.stringify(positionArr));
  indexMap.addOverLayer({
      dom: '#map-member-img',
      position: positionArr,
      offset: [38.5, -43.5],
      isCenter: true,
      name: 'memberlay',
      // centerPosition: ''
  })
}

function onOpenCarList(type) {
  var carArr = [];
  if (type == '1') {
      carArr = carList;
  } else if (type == '2') {
      for (var i = 0; i < carList.length; i++) {
        if (carList[i].status != '3') {
          carArr.push(carList[i]);
        }
      }
  } else if (type == '3') {
      for (var i = 0; i < carList.length; i++) {
        if (carList[i].status == '3') {
          carArr.push(carList[i]);
        }
      }
  }
  api.openFrame({
      name: 'selectCar_Frame',
      url: './selectCar_Frame.html',
      rect: {
          x: 0,
          y: 0,
      },
      pageParam: {
          carArr: carArr,
          type: type
      },
      bounces: false,
      bgColor: 'rgba(0,0,0,0)',
      vScrollBarEnabled: false,
      hScrollBarEnabled: false
  });

}

function onOpenCarInfo(item) {
  var body = {
    carIds: [parseInt(item.carId)],
  };
  fnPost("services/Security/CarRealTimeInfoService/GetRealTimeInfo", [parseInt(item.carId)], "application/json", true, false, function(ret, err){
    api.hideProgress();
    if (ret && ret.success) {
      var carInfo = ret.result[0];
      carTrackRrajectory = ret.result[0];
      $(".carNumber").text(carInfo.carNumber);
      $(".address").text("当前位置：" + carInfo.carNumber);
      $(".ownerName").text("车主：" + carInfo.ownerName);
      $(".speed").text("速度：" + carInfo.speed + "km/h");
      $(".car-status-text").text(carInfo.carStatusStr);
      if (carInfo.carStatus == '3') {
          $(".status-dian").addClass('bgc-dan');
      } else {
          $(".status-dian").removeClass('bgc-dan');
      }

      $(".signal-weak-text").text(carInfo.signal);
      if (carInfo.signal == '弱') {
          $(".signal-strong").attr('src', '../../image/signal-weak.png');
      } else {
          $(".signal-strong").attr('src', '../../image/signal-strong.png');
      }

      $(".trajectoryTime").text("时间：" + carInfo.trajectoryTime.replace("T"," "));

      $(".map-footer").removeClass("aui-hide");
    }
  });
}

// 追踪车辆
function onTrack() {

}

// 车辆轨迹
function onTrajectory() {
  api.openWin({
      name: 'carTrajectory',
      url: './carTrajectory.html',
      pageParam: {
          carInfo: carTrackRrajectory
      }
  });

}

function onOpenUseCar() {
  api.openWin({
      name: 'useCar',
      url: './useCar.html',
      pageParam: {
          name: 'test'
      }
  });

}

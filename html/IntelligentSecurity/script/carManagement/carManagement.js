
var indexMap = {};

var carList = [];
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
          indexMap.map.getView().setCenter(location);
          indexMap['memberlay']['0'].setPosition(location);
      });
  });

  onGetCarArr();
}

function onGetCarArr() {
  // 模拟汽车数据
  carList = [
    {"id": "0001", "type": "0", "carName": "渝A66666", "position": ["106.5025712070178", "29.591623152627714"]},
    {"id": "0002", "type": "1", "carName": "渝A88888", "position": ["106.5325712070178", "29.551623152627714"]},
    {"id": "0003", "type": "0", "carName": "渝A99999", "position": ["106.5325712070178", "29.501623152627714"]},
  ];

  var datas = {
      datas: carList
  };

  var str = template('carLayer', datas);

  $(".map-member-img").remove();
  $('.flex-wrap').append(str);

  onCreateCarLayer(carList);
}

function onCreateCarLayer(carArr) {
  var positionArr = [];
  for (var i = 0; i < carArr.length; i++) {
    positionArr.push(carArr[i].position);
  }
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
  api.openFrame({
      name: 'selectCar_Frame',
      url: './selectCar_Frame.html',
      rect: {
          x: 0,
          y: 0,
      },
      pageParam: {
          name: 'test'
      },
      bounces: false,
      bgColor: 'rgba(0,0,0,0)',
      vScrollBarEnabled: false,
      hScrollBarEnabled: false
  });

}

function onOpenCarInfo(item) {
  console.log(JSON.stringify(item))
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

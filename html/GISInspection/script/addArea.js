
var addAreaPoint = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  // 接收新增区域坐标
  api.addEventListener({
      name: 'addAreaPoint'
  }, function(ret, err){
      addAreaPoint = ret.value.areaPoint;
      console.log(JSON.stringify(addAreaPoint));
      for (var i = 0; i < addAreaPoint.length; i++) {
        console.log(typeof addAreaPoint[i]);
      }
  });

}

function onOpenDivide() {

  api.openWin({
      name: 'areaDivide',
      url: './areaDivide.html',
      pageParam: {
          addAreaPoint: addAreaPoint
      }
  });

}

function onOpenLayer() {
  api.openWin({
      name: 'areaLayer',
      url: './areaLayer.html',
      pageParam: {
          name: 'test'
      }
  });

}


// 绘图的颜色
var drawStyle =new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00F5B4',
        width: 3,
        // lineDash: [2, 2, 2, 2, 2, 2, ]
    }),
    fill:new ol.style.Fill({
      color:'rgba(113, 128, 248, 0.5)'
    })
})

 // 判断第二次点击清除画的图
 var isSecondClick = false;
// 距离长度测量
var drawObjThat = null;
function getMeasure(that,type,remove = false) {
  drawObjThat = that;
  footerLiActive(that);
  removeAddLayer('measureLayer',map.getView().getZoom());
    var drawType =null;
    if(type == 'length'){
      drawType ='LineString';
    }else {
      drawType ='Polygon';
    }
     if(isSecondClick){
       $(that).removeClass('li_active');
       clickClearMapSurvey();
       isSecondClick = false;
     }else {
      isSecondClick = true;
      var measureLayer = new ol.layer.Vector({
          source: new ol.source.Vector,
          style: drawStyle
      });
      measureLayer.set('name','measureLayer');
      map.addLayer(measureLayer);
       measureDraw = new ol.interaction.Draw({
        type: drawType,
        source: measureLayer.getSource(), // 注意设置source，这样绘制好的线，就会添加到这个source里
        style: new ol.style.Style({ // 设置绘制时的样式
          stroke: new ol.style.Stroke({
            color: '#00F5B4',
            width: 1,
          })
        }),
        // maxPoints: 2 // 限制不超过4个点
      });
      // 监听线绘制结束事件，获取坐标
      measureDraw.on('drawend', function(event) {
        getLengthAreaText(type,event);
        map.removeInteraction(measureDraw); //取消绘制
          // setTimeout(()=>{
          //   map.on('singleclick',clearMapDraw);
          // },1500);

      });
      // 为地图添加一个绘图交互
      map.addInteraction(measureDraw);
      // 添加一个显示文字信息的layer
     }


}

// 显示长度距离的layer
function getLengthAreaText(type,event) {
  var overlayPosition = null;
  var coordinates = JSON.parse(JSON.stringify(event.feature.getGeometry().getCoordinates()));
  var info = document.getElementById('lengthArea');
      info.style.display = 'block';
    if (type == 'length') {
      info.style.minWidth = '7rem';
      var Sphere = new ol.Sphere(6378137);
      var distance = ol.Sphere.getLength(event.feature.getGeometry(),{projection:'EPSG:4326'});
      if (distance > 1000) {
        distance = (distance / 1000).toFixed(2);
      $('#length_content').text("长度:"+distance + 'km');
      } else {
          $('#length_content').text("长度:"+ distance.toFixed(2) + 'm');
      }
      overlayPosition = coordinates[coordinates.length-1];
    } else {
      info.style.minWidth = '7.5rem';
      var area = ol.Sphere.getArea(event.feature.getGeometry(),{projection:'EPSG:4326'});
      if (area > 1000000) {
        area = (area / 1000000).toFixed(2);
          $('#length_content').text("面积:"+ area + 'km²');
      } else {
          $('#length_content').text("面积:"+ area.toFixed(2) + 'm²');
      }
      overlayPosition = event.feature.getGeometry().getInteriorPoint().getCoordinates();//设置图标到画的面积中间
    }
    // 把图标呼叫到地图上.,需要一个ol.Overlay
    var anchor = new ol.Overlay({
      element: info,
      position:overlayPosition,
      positioning: 'bottom-center'
    });
    anchor.set('name','lengthOverlay');
    // 将图标添加到地图上
    map.addOverlay(anchor);
}





var clearMapDraw = function(evt){
  $(drawObjThat).removeClass('li_active');
  clickClearMapSurvey();
  isSecondClick = false;
  map.un('singleclick',clearMapDraw);
}

// 清除图层，重新绘制图
function clickClearMapSurvey(){
    var info = document.getElementById('lengthArea');
      info.style.display = 'none';
      removeAddLayer('measureLayer',map.getView().getZoom());
}

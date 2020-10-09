// 初始化地图
// var map = {};

// this.addMember(this.memberList);
//
;(function(window){
    /**
    * @method 初始化地图
    * @param {Object} options 地图需要的参数
    * mapid: 地图标签的id名
    * zoom： 地图初始化的缩放比列
    */
    function Map(options) {
        this.map = {};
        this.zoomMap = (options && options.zoom) || '12';
        mapid = (options && options.mapid) || 'map';
        this.init(mapid);
    }
    Map.prototype = {
        // 初始化地图
        init: function(mapid) {
            var SNTGIS = window.SNTGIS;
            var tdMap = new SNTGIS.layer.TDMap({
              token: '7ab767e38fe3d9c04f144a091cff214f',
              type: 1,
              layerName: '天地图电子底图'
            });
            var dmLayer = new SNTGIS.layer.TDMap({
              token: '7ab767e38fe3d9c04f144a091cff214f',
              type: 4,
              layerName: '天地图电子底图'
            });
            var zoomMap = this.zoomMap;
            this.map = new SNTGIS.Map({
              layers: [tdMap, dmLayer],
              center: [106.548293, 29.565552],
              zoom: zoomMap,
              maxZoom: 18,
              minZoom: 5,
              target: mapid
            });
        },
        // 初始化区域图层
        initArea: function() {
            // 区域样式
            var drawAreaStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                  color: 'rgba(75, 119, 190, 0.5)'
                }),
                stroke: new window.ol.style.Stroke({
                  color: 'rgba(255, 255, 255, 0.5)',
                  width: 2
                }),
                image: new window.ol.style.Circle({
                  radius: 7,
                  fill: new window.ol.style.Fill({
                    color: 'rgba(75, 119, 190, 0.5)'
                  })
                })
              });
              // 区域数据源
              var drawAreaSoure = new window.ol.source.Vector({});
              // 区域图层
              var drawAreaLayer = new window.ol.layer.Vector({
                source: drawAreaSoure,
                updateWhileInteracting: true,
                style: drawAreaStyle
            });
            this.drawAreaSoure = drawAreaSoure;
            this.map.addLayer(drawAreaLayer);
        },

        // 向地图绘制区域
        // areaList区域字符串列表  '经度,纬度;经度,纬度'
        drawAreaSelect: function(areaPoint) {
            // for(var i = 0; i < areaList.length; i++) {
            var areaPointsArr = areaPoint.split(';');
            var pointsArray = new Array();
            for (let i = 0; i < routeAreaPointsArr.length - 1; i++) {
                var element = routeAreaPointsArr[i];
                var routeAreaPointArr = element.split(',');
                pointsArray.push(routeAreaPointArr);
            }
            var areaFeatye = new window.ol.Feature({
                geometry: new window.ol.geom.Polygon([pointsArray])
            });
            this.drawAreaSoure.addFeature(areaFeatye);
            // }
        },


    }
    window.Map = Map;
})(window);

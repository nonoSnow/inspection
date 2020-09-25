

 // 收藏的管点管线查询信息
 // 管线
 var queryLineInfoclayersource = new ol.source.Vector({
     format: new ol.format.GeoJSON(),
     wrapX: false
 });
 var queryLineInfoclayer = new ol.layer.Vector({
     source: queryLineInfoclayersource,
     style: new ol.style.Style({
         fill: new ol.style.Fill({
             color: '#0081F5'
         }),
         stroke: new ol.style.Stroke({
             color: '#0081F5',
             width: 3
         }),
     })
 });
 // 管点
 var bookmarkImg = './image/bookmark.png';
 var queryPointInfoclayersource = new ol.source.Vector({
     format: new ol.format.GeoJSON(),
     wrapX: false
 });
  var queryPointInfoclayer = new ol.layer.Vector({
       source: queryPointInfoclayersource,
       style: new ol.style.Style({
           image: new ol.style.Icon({
               src: bookmarkImg,
               scale: 0.5
           }),
       })
   });
  var pointSelectSingleClick = new ol.interaction.Select({
       layers: [queryPointInfoclayer, queryLineInfoclayer],
       style: new ol.style.Style({
           image: new ol.style.Icon({
               src: bookmarkImg,
               scale: 0.6
           }),
       }),
       hitTolerance: 2

   });

 // 收藏的管点管线查询信息结束

 // 地图操作
 function getTdtLayer(lyr) {
     var urls = [];
     for (var i = 0; i < 4; i++) {
         urls.push("http://t" + i + ".tianditu.com/DataServer?T=" + lyr +
             "&X={x}&Y={y}&L={z}&tk=8c8a425c56da4762aeef3f79346aaa8b")
     }
     var layer = new ol.layer.Tile({
         source: new ol.source.XYZ({
             urls: urls
         })
     });
     return layer;
 }



 //  初始化天地图
 function initMap() {
   var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
     // [104.1341129,29.98951396]
     //view
     var view = new ol.View({
         // 设置重庆为地图中心
         center:[104.1341129,29.98951396],
         projection: 'EPSG:4326',
        //  minZoom: getAppMapSetConfig.maxZoom,
        //  maxZoom:getAppMapSetConfig.minZoom,
         zoom: 8,

     });
     map = new ol.Map({
         controls: [],
         layers: [getTdtLayer("vec_w"), getTdtLayer("cva_w")],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
     // addLineLayer();
     if (JSON.stringify(arguments) == "{}") {
         map.on('moveend', onMoveEnd);
     }
     map.addInteraction(pointSelectSingleClick);

 }

 //初始化地图 （用于新增管点管线页面）
 function initpointMap() {
      var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
   var view = new ol.View({
       // 设置重庆为地图中心
       center:[104.1341129,29.98951396],
       projection: 'EPSG:4326',
       zoom: 8,
      //  minZoom:getAppMapSetConfig.maxZoom,
      //  maxZoom:getAppMapSetConfig.minZoom
   });
     pointOrPipemap = new ol.Map({
         controls: [],
         layers: [getTdtLayer("vec_w"), getTdtLayer("cva_w")],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
 }
 //初始化地图 （用于新增管点管线页面）
 function initEditMap() {
      var getAppMapSetConfig = $api.getStorage('getAppMapSetConfig');
   var view = new ol.View({
       // 设置重庆为地图中心
       center:[104.1341129,29.98951396],
       projection: 'EPSG:4326',
       zoom: 8,
      //  minZoom:etAppMapSetConfig.maxZoom,
      //  maxZoom:getAppMapSetConfig.minZoom
   });
     editManageMap = new ol.Map({
         controls: [],
         layers: [getTdtLayer("vec_w"), getTdtLayer("cva_w")],
         view: view,
         interactions: ol.interaction.defaults({
             doubleClickZoom: false,
             pinchRotate: false,
         }),
         target: 'map'
     });
 }


 // 禁止地图转动
 function viewChangeRotation() {
     map.getView().on('change:rotation', function(event) {
         map.getView().setRotation(0);
     })
 }

 // 地图长按事件监听
 var longPressMapObj = {
     time: 0,
     timeOutEvent: null
 }

 function longPressMap() {
     map.on('pointerdown', function(event) {});
     map.on('pointerup', pointerupFun);
     map.on('pointerdrag', function(event) {
         map.un('pointerup', pointerupFun); //为地图添加监听pointerUp事件
     });

 }
 var pointerupFun = function(event) {
     var coordinate = event.coordinate;
     navOverLay(coordinate, type = null, true);
     map.un('pointerup', pointerupFun);
 }

 // 视图(实现前视图和后视图，需要监听每次结束后的位置)
 var if_mouse = true;
 var now_view = -1;
 var view_list = [];

 function onMoveEnd(evt) {
     if (if_mouse) {
         var new_list = [];
         temp = now_view;
         if (view_list.length > 1) {
             for (var i = 0; i < temp + 1; i++) {
                 new_list.push(view_list[i]);
             }
             now_view++;
             new_list.push({
                 'zoom': map.getView().getZoom(),
                 'Center': map.getView().getCenter()
             });
             view_list = new_list;
         } else {
             view_list.push({
                 'zoom': map.getView().getZoom(),
                 'Center': map.getView().getCenter()
             });
             now_view++;
         }
     } else {
         if_mouse = true;
     }
 }

 function handleView(type) {
     if (type == 'last') {
         if_mouse = false;
         if (now_view - 1 < 0) now_view = 0;
         else now_view = now_view - 1;
         var temp_view = view_list[now_view];
         map.getView().animate({
             center: temp_view['Center'],
             zoom: temp_view['zoom'],
             duration: 500
         });
     } else {
         if_mouse = false;
         if (now_view + 1 >= view_list.length) now_view = now_view;
         else now_view = now_view + 1;
         var temp_view = view_list[now_view];
         map.getView().animate({
             center: temp_view['Center'],
             zoom: temp_view['zoom'],
             duration: 500
         });
     }
 }

 // 添加移动图标功能
 function addMoveInteraction(map) {
     var app = {};
     app.Drag = function() {

         ol.interaction.Pointer.call(this, {
             handleDownEvent: app.Drag.prototype.handleDownEvent,
             handleDragEvent: app.Drag.prototype.handleDragEvent,
             handleMoveEvent: app.Drag.prototype.handleMoveEvent,
             handleUpEvent: app.Drag.prototype.handleUpEvent
         });

         this.coordinate_ = null;
         this.cursor_ = 'pointer';
         this.feature_ = null;
         this.previousCursor_ = undefined;

     };
     ol.inherits(app.Drag, ol.interaction.Pointer);

     app.Drag.prototype.handleDownEvent = function(evt) {
         var map = evt.map;

         var feature = map.forEachFeatureAtPixel(evt.pixel,
             function(feature) {
                 return feature;
             });

         if (feature) {
             var geom = (feature.getGeometry());
             if (geom instanceof ol.geom.MultiPolygon) {
                 return;
             } else if (geom instanceof ol.geom.LineString) {
                 return;
             } else {
                 this.coordinate_ = evt.coordinate;
                 // alert(evt.coordinate[0]);
                 this.feature_ = feature;
             }
         }
         return !!feature;
     };

     app.Drag.prototype.handleDragEvent = function(evt) {
         // 返回拖动期间所有的坐标点
         var deltaX = evt.coordinate[0] - this.coordinate_[0];
         var deltaY = evt.coordinate[1] - this.coordinate_[1];
         var geometry = this.feature_.getGeometry();
         geometry.translate(deltaX, deltaY);
         this.coordinate_[0] = evt.coordinate[0];
         this.coordinate_[1] = evt.coordinate[1];

     };
     app.Drag.prototype.handleMoveEvent = function(evt) {
         if (this.cursor_) {
             var map = evt.map;
             var feature = map.forEachFeatureAtPixel(evt.pixel,
                 function(feature) {
                     //alert("handleMoveEvent");
                     return feature;
                 });
             var element = evt.map.getTargetElement();
             if (feature) {
                 if (element.style.cursor != this.cursor_) {
                     this.previousCursor_ = element.style.cursor;
                     element.style.cursor = this.cursor_;
                 }
             } else if (this.previousCursor_ !== undefined) {
                 element.style.cursor = this.previousCursor_;
                 this.previousCursor_ = undefined;
             }
         }
     };

     app.Drag.prototype.handleUpEvent = function(evt) {
         //拖动以后触发操作 放下拖动后结束 返回最后的最新的坐标点
         // 最新的坐标
         // console.log('this.coordinate_[0]' + evt.coordinate[0]);
         // console.log(' this.coordinate_[1]' + evt.coordinate[1]);
         api.sendEvent({
             name: 'newCoordinate',
             extra: {
                 lon: evt.coordinate[0],
                 lat: evt.coordinate[1]
             }
         });
         this.coordinate_ = null;
         this.feature_ = null;
         return false;
     };
     appD = new app.Drag();
     //将交互添加到map中
     map.addInteraction(appD);
 }


 // 验证登录 (请求管点管线的验证登录)
 function authenticateUser(user, password) {
     var token = user + ":" + password;
     var hash = "Basic " + Base64.encode(token);
     return hash;
 }

 // 移除图层
 function removeAddLayer(layername, zoom, currentMap = null) {
     var activetMap = null;
     if (currentMap == null) {
         activetMap = map;
     } else {
         activetMap = currentMap;
     }
     var layers = activetMap.getLayers().array_;
     for (var i = 0; i < layers.length; i++) {
         var targetLayer = layers[i].get('name');
         var j = i;
         var target = activetMap.getLayers().item(j);
         if (targetLayer == layername) {
             activetMap.removeLayer(target);
             activetMap.getView().setZoom(zoom);
             break;
         }
     }
     // activetMap.un('singleclick',pointPipeClickSearch);
 }
 // 清除overlay
 function clearOverlay(overlayName) {
     var overlays = map.getOverlays().array_;
     for (var i = 0; i < overlays.length; i++) {
         var targetLayer = overlays[i].get('name');
         var j = i;
         var target = map.getOverlays().item(j);
         if (targetLayer == overlayName) {
             map.removeOverlay(target);
             break;
         }
     }
 }
 // 清除Interactions
 function clearInteractions(overlayName) {
     var overlays = map.getInteractions().array_;
     for (var i = 0; i < overlays.length; i++) {
         var targetLayer = overlays[i].get('name');
         var j = i;
         var target = map.getInteractions().item(j);
         if (targetLayer == overlayName) {
             map.removeInteraction(target);
             break;
         }
     }
 }

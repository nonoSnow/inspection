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
        options = Object.assign({
            mapid: 'map',
            zoom: 16
        }, options);
        this.map = {};
        this.zoomMap = options.zoom;
        // this.zoomMap = (options && options.zoom) || '12';

        // 初始化地图的用户名和密码
        window.SNTGIS.userName = 'admin';
        window.SNTGIS.passWord = 'Sntsoft123';

        this.init(options.mapid);

    }
    Map.prototype = {
        // 初始化地图
        init: function(mapid) {
            var SNTGIS = window.SNTGIS;
            var pointLayer = new SNTGIS.layer.TileWMS({
                url: mapwms,
                layers: 'OpenGIS:GisPoint',
                layerName: '管点图'
            });
            this.pointLayer = pointLayer;
            pointLayer.setMaxResolution(0.0000107288);
            var lineLayer = new SNTGIS.layer.TileWMS({
                url: mapwms,
                layers: 'OpenGIS:GisLine',
                layerName: '管线图'
            });
            this.lineLayer = lineLayer;
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
              layers: [tdMap, dmLayer, pointLayer, lineLayer],
              center: [106.548293, 29.565552],
              zoom: zoomMap,
              maxZoom: 18,
              minZoom: 5,
              target: mapid
            });
        },

        // 向地图中添加悬浮元素
        addOverLayer: function(layObj) {
            var name = layObj.name || 'overlay';
            var index = layObj.index || 1;
            if(layObj.isCenter) {
                // this.map.getView().setCenter(layObj.position);
            }
            var elDom = document.querySelector(layObj.dom);
            layObj = Object.assign({}, {
                positioning: 'center-center',
                className: 'customer-anchor customer-anchor-1',
                element: elDom
            }, layObj);

            var overlayEl = new window.ol.Overlay(layObj);
            this[name] = {...this[name], [index + '']: overlayEl}
            this.map.addOverlay(overlayEl);
        },

        // 初始化区域图层
        initArea: function(name) {
            name = name || 'area'
            var layerName = name + 'layer';
            var sourceName = name + 'source';
            // 区域样式
            var areaStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                    color: 'rgba(153, 153, 153, 0.1)'
                }),
                stroke: new window.ol.style.Stroke({
                    lineDash:[2,4],
                    lineCap: 'round',
                    color: 'rgba(153, 153, 153, 1)',
                    width: 2
                })
            });
            // 区域数据源
            var areaSoure = new window.ol.source.Vector({});
            // 区域图层
            var areaLayer = new window.ol.layer.Vector({
                source: areaSoure,
                updateWhileInteracting: true,
                style: areaStyle
            });
            this[sourceName] = {
                source : areaSoure,
                layer : areaLayer
            }
            this.map.addLayer(areaLayer);
        },

        // 初始化管点 管线图层
        initDeviceLayer: function(name) {
            var layername = name ? name + 'PointLayer' : 'selectPointLayer'
            var sourcename = name ? name + 'PointSource' : 'selectPointSource'
            let selectPointStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                    color: 'rgba(196, 211, 231, 0.5)'
                }),
                stroke: new window.ol.style.Stroke({
                    color: 'rgba(252, 7, 7, 1)',
                    width: 3
                    })
                })
            let selectPointSource = new window.ol.source.Vector({});
            this[sourcename] = selectPointSource;
            var selectPointLayer = new window.ol.layer.Vector({
                source: selectPointSource,
                updateWhileInteracting: true,
                style: selectPointStyle
            });
            this[layername] = selectPointLayer;
            this.map.addLayer(selectPointLayer);

            var linelayer = name ? name + 'LineLayer' : 'selectLineLayer'
            var linesource = name ? name + 'LineSource' : 'selectLineSource'

            let selectLineStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                    color: 'rgba(252, 7, 7, 0.5)'
                }),
                stroke: new window.ol.style.Stroke({
                    color: 'rgba(48, 99, 181, 0.5)',
                    width: 4
                }),
            })
            let selectLineSource = new window.ol.source.Vector({});
            this[linesource] = selectLineSource;

            var selectLineLayer = new window.ol.layer.Vector({
                source: selectLineSource,
                updateWhileInteracting: true,
                style: selectLineStyle
            });
            this[linelayer] = selectLineLayer;
            this.map.addLayer(selectLineLayer);
        },

        // 开启地图点击事件 选中区域 并执行其他操作
        initMapClick: function() {
            this.map.on('singleclick', this.mapClickEvent, this);
        },

        // 点击地图执行的事件  改变点所在的区域的样式 并将其他的样式重置会初始样式
        mapClickEvent: function(e) {
            var pixel = this.map.getEventPixel(e.originalEvent);
            var featureInfo = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                return {feature:feature,layer:layer};
            });
            if(featureInfo && featureInfo.feature) {

                // 将当前feature的样式改为选中样式
                var feature = featureInfo.feature
                feature.setStyle(function() {
                    return new window.ol.style.Style({
                        fill: new window.ol.style.Fill({
                            color: 'rgba(11, 120, 230, 0.1)'
                        }),
                        stroke: new window.ol.style.Stroke({
                            lineDash:[2,4],
                            lineCap: 'square',
                            color: 'rgba(11, 120, 230, 1)',
                            width: 2
                        })
                    });
                })
                // 将当前选中的样式
                if(this.selectFeature && this.selectFeature.ol_uid != feature.ol_uid) {
                    this.selectFeature.setStyle(function() {
                        return new window.ol.style.Style({
                            fill: new window.ol.style.Fill({
                                color: 'rgba(153, 153, 153, 0.1)'
                            }),
                            stroke: new window.ol.style.Stroke({
                                lineDash:[2,4],
                                lineCap: 'square',
                                color: 'rgba(153, 153, 153, 1)',
                                width: 2
                            })
                        });
                    })
                }

                var selectAreaPoint = ''
                var flats = feature.values_.geometry.flatCoordinates;

                for (var i = 0; i < flats.length; i = i + 2) {
                    selectAreaPoint += flats[i] + ",";
                    selectAreaPoint += flats[i + 1] + ";";
                }
                selectAreaPoint += flats[0] + "," + flats[1] + ";";
                this.selectAreaPoint = selectAreaPoint;
                this.selectFeature = feature
            }
        },

        // 向地图绘制区域
        // areaList区域字符串列表  '经度,纬度;经度,纬度;'
        drawAreaSelect: function(areaList, info) {
            var areainfo = info || {};
            if(typeof areaList == 'string') {
                this.drawSingleArea(areaList, areainfo);
            } else {
                for(var i= 0; i < areaList.length; i++) {
                    this.drawSingleArea(areaList[i].areaPoint, areainfo)
                }
            }
        },

        // 绘制区域
        drawSingleArea: function(areaPoint, areainfo) {
            var name = areainfo.name || 'area'
            var sourceName = name + 'source';
            areaPoint = areaPoint.substring(0, areaPoint.length - 1);
            var areaPointsArr = areaPoint.split(';');
            var pointsArray = new Array();
            let xArray = new Array();
            let yArray = new Array();
            for (let i = 0; i < areaPointsArr.length - 1; i++) {
                var element = areaPointsArr[i];
                var routeAreaPointArr = element.split(',');
                pointsArray.push(routeAreaPointArr);
                xArray.push(routeAreaPointArr[0]);
                yArray.push(routeAreaPointArr[1]);
            }
            var areaFeatye = new window.ol.Feature({
                geometry: new window.ol.geom.Polygon([pointsArray])
            });
            this[sourceName]['source'].addFeature(areaFeatye);
            // 完成区域绘制之后将地图的中心点适配到区域范围
              var xmax = Math.max.apply(null, xArray);
              var xmin = Math.min.apply(null, xArray);
              var ymax = Math.max.apply(null, yArray);
              var ymin = Math.min.apply(null, yArray);
              this.map.getView().fit([xmin, ymin, xmax, ymax]);
        },

        // 根据区域 获取 区域内的管点管线  并选中管点管线
        // 根据区域得出与区域相交的元素
        getCommonEle: function(deviceInfo, name) {

            var selectFeature = this.selectFeature;
            console.log(selectFeature)
            var polygon = selectFeature.getGeometry();
            // coordinates =
            var wktPoint = new window.ol.format.WKT().writeGeometry(polygon, {
        		dataProjection : "EPSG:4326",
        		featureProjection : "EPSG:3857"
        	});
            let _this = this;
            // 获取选中的图层边界点
            // console.log(deviceInfo.areaPoint)
            var areaExtent = deviceInfo.areaPoint.split(';').join(' ');
            areaExtent = areaExtent.substring(0, areaExtent.length - 1);
            console.log(areaExtent)
            // areaExtent = areaExtent.replace(/\,/g, "哈");
            // areaExtent = areaExtent.replace(/\s+/g, ",");
            // areaExtent = areaExtent.replace(/\哈/g, " ");
            // console.log(areaExtent)
            // var wktPoint = 'POLYGON((' + areaExtent + '))';
            console.log(wktPoint)
            // console.log(workSpace)
            window.SNTGIS.workSpace = workSpace;
            // console.log(_this)
            // console.log(areaExtent)
            // this.getFeaturesByCoords(_this.lineLayer, areaExtent, function() {
            //     console.log(11)
            // })
            // 获取区域与管线图层相交的所有元素
            if(deviceInfo.lineList.length > 0) {
                window.SNTGIS.NetWork.getFeaturesByCoords(_this.lineLayer, areaExtent, function (data) {
                    console.log(data)
                    _this.getLineListInArea(data, deviceInfo.lineList, name)
                    // _this.lineInArea = data;
                    // if (type) {
                    //     // console.log(deviceInfo.selectLine)
                    //     // _this.drawLineSelect(deviceInfo.selectLine)
                    //     _this.getLineListInArea(data, deviceInfo.selectLine, type);
                    // }
                })
            }
            if(deviceInfo.pointList.length > 0) {
                // 获取区域与管点图层相交的所有元素
                window.SNTGIS.NetWork.getFeaturesByCoords(_this.pointLayer, areaExtent, function (data) {
                    _this.pointInArea = data;
                    console.log(data)
                    _this.getPointListInArea(data, deviceInfo.pointList, name);
                    // if (type) {
                    //     // _this.drawPointSelect(deviceInfo.selectPoint)
                    //     _this.getPointListInArea(data, deviceInfo.selectPoint, type);
                    // }
                })
            }

        },

        getFeaturesByCoords(layer, coords, callback) { //IsSelect 为false时为搜索页面查询信息，不可点击， 为ture是，为首页查询信息，可以select查询信息
        //    DataObj = data;
        //    DataObj.IsSelect = IsSelect;
           // point
        //    var url = `http://119.3.192.111:5431/geoserver/OpenGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=OpenGIS%3AGetPointByName&outputFormat=application%2Fjson&viewparams=number:${data.number}`;
        //    var url=getAppMapSetConfig.collectPoint+`:${data.number}`;
        // http://118.122.84.146:8595/geoserver/wms
           var source = layer.getSource();
           var layerName = source.params_.LAYERS;
           var layerNameArray = layerName.split(":");
           if (layerNameArray.length == 2) {
               var ajax = new XMLHttpRequest();
               var url = source.urls[0];
            //    var url = source.urls[0].replace('/wms','/wfs');
            // console.log(layerNameArray[0])
            //    url = url.replace('/'+layerNameArray[0],'');
               console.log(url)
               ajax.open('get', url);
               ajax.withCredentials = true;
               ajax.setRequestHeader("Authorization", authenticateUser('admin', "Sntsoft123"));
               ajax.send();
               ajax.onreadystatechange = function() {
                   if (ajax.readyState == 4 && ajax.status == 200) {
                       console.log(ajax.responseText)
                       feature = queryPointInfoclayersource.getFormat().readFeatures(ajax.responseText);
                       queryPointInfoclayersource.addFeatures(feature);
                   }
               };
               ajax.ontimeout = function(e) {

               };
               ajax.onerror = function(e) {

               };
            }
        //    map.getView().setZoom(18);
        },

        // getFeaturesByCoords: function(layer, coords, callback) {
        //     console.log(222)
        //     var source = layer.getSource();
        //     var layerName = source.params_.LAYERS;
        //     var layerNameArray = layerName.split(":");
        //     if (layerNameArray.length == 2) {
        //         var url = source.urls[0].replace('/wms','/wfs');
        //         url = url.replace('/'+layerNameArray[0],''); //获取服务器wfs服务地址
        //         var xml = getInsectsOGCXMLFromParams(SNTGIS.workSpace, layerNameArray[0], layerNameArray[1], coords);
        //         console.log(xml)
        //         ajaxMethod({
        //             url: url,
        //             data: xml,
        //             headers: {
        //                 'Content-Type': 'text/plain;charset=UTF-8',
        //                 'Authorization': authenticateUser(SNTGIS.userName, SNTGIS.passWord)
        //             },
        //             timeout: 30,
        //             success: function(res) {
        //                 console.log(JOSN.stringify(res))
        //             },
        //             fail: function(err) {
        //                 console.log(JOSN.stringify(err))
        //             }
        //         })
        //         // var ajax = new XMLHttpRequest();
        //         // var ajax = new XMLHttpRequest();
        //         // ajax.open('POST', url);
        //         // ajax.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        //         // ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
        //         // ajax.send(xml);
        //         // ajax.onreadystatechange = function () {
        //         //     if (ajax.readyState == 4 && ajax.status == 200) {
        //         //         try {
        //         //             callback(JSON.parse(ajax.responseText).features)
        //         //         } catch (error) {
        //         //             console.log(error)
        //         //         }
        //         //     }
        //         // };
        //     }
        // },

        // 根据数据返回的管线 判断是否在传入的区域内 并绘制在区域内的管线
        getLineListInArea: function(allLineList, checkedLine, name) {
            var lineList = [];
            console.log(checkedLine)
            for(let i = 0; i < checkedLine.length; i++) {
                for(let j = 0; j < allLineList.length; j++) {
                    if(checkedLine[i].deviceCode ==allLineList[j].properties.LineNumber) {
                        let x = (allLineList[j].geometry.coordinates[0][0] + allLineList[j].geometry.coordinates[1][0]) / 2;
                        let y = (allLineList[j].geometry.coordinates[0][1] + allLineList[j].geometry.coordinates[1][1]) / 2;
                        lineList.push({
                            deviceCode: allLineList[j].properties.LineNumber,
                            deviceName: allLineList[j].properties.Material,
                            devicePoint: x + ',' + y,
                            address: allLineList[j].properties.Location,
                            deviceLoaction: allLineList[j].geometry.coordinates,
                        });
                        break;
                    }
                }
            }
            // if(type == 1) {
            //     this.areaObj.lineLength = lineLength;
            //     this.areaObj.lineList = lineList;
            console.log(lineList)
            this.drawLineSelect(lineList, name);
            // }else if(type == 2) {
            //     this.drawLineCheckFunc(lineList);
            // }
        },

        // 根据数据返回的管点 判断是否在传入的区域内 并绘制在区域内的管点
        getPointListInArea: function(allPointList, checkedPoint, name) {
            var pointList = [];
            for(let i = 0; i < checkedPoint.length; i++) {
                for(let j = 0; j < allPointList.length; j++) {
                    console.log(checkedPoint)
                    if(checkedPoint[i].deviceCode ==allPointList[j].properties.PointNumbe) {
                        pointList.push({
                            deviceCode: allPointList[j].properties.PointNumbe,
                            deviceName: allPointList[j].properties.PointName,
                            devicePoint: allPointList[j].geometry.coordinates.join(','),
                            address: allPointList[j].properties.Location,
                            deviceLoaction: allPointList[j].geometry.coordinates
                        });
                        break;
                    }
                }
            }
            // if(type == 1) {
            //     this.areaObj.selectPoint = pointList;
                this.drawPointSelect(pointList);
            // } else if(type == 2) {
            //     this.drawPointCheckFunc(pointList);
            // }
        },
        // 选中管线
        drawLineSelect: function(selectLineList, name) {
            var linesource = name ? name + 'LineSource' : 'selectLineSource'
            for(let i = 0; i< selectLineList.length; i++) {
                let lineFeatype = new window.ol.Feature({
                    geometry: new window.ol.geom.Polygon([selectLineList[i].deviceLoaction])
                })
                this[linesource].addFeature(lineFeatype);
            }
        },

        // 选中管点
        drawPointSelect: function(selectPointList, name) {
            var pointsource = name ? name + 'PointSource' : 'selectPointSource'
            for(let i = 0; i< selectPointList.length; i++) {
                let pointFeatype = new window.ol.Feature({
                    geometry: new window.ol.geom.Circle(selectPointList[i].deviceLoaction, 0.00005)
                })
                this[pointsource].addFeature(pointFeatype);
            }
        },

        // 改变地图的缩放  isScale 表示放大还是缩小  0表示缩小  1表示放大
        changeAreaScale: function(isScale) {
            var zoom = this.zoomMap;
            if(isScale) {
                zoom++;
            } else {
                zoom--;
            }
            zoom = zoom <= 18 ? zoom : 18;
            zoom = zoom >= 5 ? zoom : 5;
            this.zoomMap = zoom;
            this.map.getView().setZoom(zoom);
        }
    }
    window.Map = Map;
})(window);

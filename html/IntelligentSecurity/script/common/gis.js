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
              center: [119.014598, 31.595281],
              zoom: zoomMap,
              maxZoom: 18,
              minZoom: 5,
              target: mapid
            });
        },

        /** 向地图中添加悬浮元素
         * layObj 悬浮元素需要的数据
         * name  悬浮元素需要作为对象存储的名称及类名的名称依据  非必填
         * position 二位数据  悬浮位置的数组列表 必填
         * isShow 是否一开始就添加到地图中   true为是  false 后期添加  默认为true
         * centerPosition  是否默认需要将地图定位到居中位置  是传入居中位置[经度， 维度]
         * dom  标签id除了序号的名称 比如  aa-0 传入#aa  序号在id中必须有的  从0开始
        */
        addOverLayer: function(layObj) {
            layObj = Object.assign({}, {
                name: 'anchor',
                positioning: 'center-center',
                isShow: true
            }, layObj)
            var location = layObj.position
            var dom = layObj.dom;
            for(var i = 0; i< location.length; i++) {
                layObj.position = location[i];

                layObj.dom = dom + '-' + i
                layObj.index = i
                this.addOverLayerEvent(layObj)
            }
            if(layObj.centerPosition) {
                this.map.getView().setCenter(layObj.centerPosition);
            }
        },

        addOverLayerEvent: function(layObj) {
            var name = layObj.name;
            var index = layObj.index;
            var elDom = document.querySelector(layObj.dom);
            layObj = Object.assign({}, {
                positioning: 'center-center',
                className: 'customer-' + name + 'customer-' + name + '-' + index,
                element: elDom
            }, layObj);

            var overlayEl = new window.ol.Overlay(layObj);
            this[name] = {...this[name], [index + ''] : overlayEl}
            this.map.addOverlay(overlayEl)
            // layObj.isShow ? this.map.addOverlay(overlayEl) : '';
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
            //   this.map.getView().fit([xmin, ymin, xmax, ymax]);
        },

        // 根据区域 获取 区域内的管点管线  并选中管点管线
        // 根据区域得出与区域相交的元素
        getCommonEle: function(deviceInfo, name) {

            var selectFeature = this.selectFeature;
            var polygon = selectFeature.getGeometry();
            // coordinates =
            // var wktPoint = new window.ol.format.WKT().writeGeometry(polygon, {
        	// 	dataProjection : "EPSG:4326",
        	// 	featureProjection : "EPSG:3857"
        	// });
            let _this = this;
            // 获取选中的图层边界点
            // console.log(deviceInfo.areaPoint)
            var areaExtent = deviceInfo.areaPoint.split(';').join(' ');
            areaExtent = areaExtent.substring(0, areaExtent.length - 1);
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
               ajax.open('get', url);
               ajax.withCredentials = true;
               ajax.setRequestHeader("Authorization", authenticateUser('admin', "Sntsoft123"));
               ajax.send();
               ajax.onreadystatechange = function() {
                   if (ajax.readyState == 4 && ajax.status == 200) {
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
        },

        // 初始化轨迹图层
        initLineOrbit: function(name) {
            var _this = this;
            var layername = name ? name + 'OrbitLayer' : 'lineOrbitLayer'
            var sourcename = name ? name + 'OrbitSource' : 'lineOrbitSource'

            let orbitSource = new window.ol.source.Vector({});
            this[sourcename] = orbitSource;
            var orbitLayer = new window.ol.layer.Vector({
                source: orbitSource,
                updateWhileInteracting: true,
                style: _this.orbitStyle,
                zoom: _this.zo
            });
            this[layername] = orbitLayer;
            this.map.addLayer(orbitLayer);
        },
        /*
            样式方法回调  返回路径样式及 路径上箭头 及 箭头样式和旋转角度
            feature: 地图上的要素对象，既有属性，也有坐标图形。
            res：当前地图分辨率参数。
        */
        orbitStyle: function(feature, res) {
            let _this = this;
            var geometry = feature.getGeometry();
            var length = geometry.getLength();
            var stpes = 40;
            var geo_steps = stpes * res;
            var arrowsNum = parseInt(length / geo_steps);
            var styles = [
                // linestring
                new ol.style.Style({
                    stroke: new window.ol.style.Stroke({
                        color: 'rgba(29, 191, 124, 1)',
                        width: 6
                    }),
                })
            ];
            var tree = new RBush();
            geometry.forEachSegment(function(start, end) {
                var dx = end[0] - start[0];
                var dy = end[1] - start[1];

                //计算每个segment的方向，即箭头旋转方向
                var rotation = Math.atan2(dy, dx);
                var geom = new ol.geom.LineString([start, end]);
                var extent = geom.getExtent();
                var item = {
                    minX: extent[0],
                    minY: extent[1],
                    maxX: extent[2],
                    maxY: extent[3],
                    geom: geom,
                    rotation: rotation
                };
                tree.insert(item);
            });
            for (var i = 1; i < arrowsNum; i++) {
                var arraw_coor = geometry.getCoordinateAt(i * 1.0 / arrowsNum);
                var tol = 0.0001; //查询设置的点的容差，测试地图单位是米。如果是4326坐标系单位为度的话，改成0.0001.
                var arraw_coor_buffer = [arraw_coor[0] - tol, arraw_coor[1] - tol, arraw_coor[0] + tol, arraw_coor[1] + tol];
                //进行btree查询
                var treeSearch = tree.search({
                    minX: arraw_coor_buffer[0],
                    minY: arraw_coor_buffer[1],
                    maxX: arraw_coor_buffer[2],
                    maxY: arraw_coor_buffer[3]
                });
                var arrow_rotation;
                //只查询一个，那么肯定是它了，直接返回
                if (treeSearch.length == 1)
                    arrow_rotation = treeSearch[0].rotation;
                else if (treeSearch.length > 1) {
                    var results = treeSearch.filter(function(item) {
                        //箭头点与segment相交，返回结果。该方法实测不是很准，可能是计算中间结果
                        //保存到小数精度导致查询有点问题
                        // if(item.geom.intersectsCoordinate(arraw_coor))
                        //   return true;

                        //换一种方案，设置一个稍小的容差，消除精度问题
                        var _tol = 0.00001; //消除精度误差的容差
                        if (item.geom.intersectsExtent([arraw_coor[0] - _tol, arraw_coor[1] - _tol, arraw_coor[0] + _tol, arraw_coor[1] + _tol]))
                            return true;
                    })
                    if (results.length > 0)
                        arrow_rotation = results[0].rotation;
                }
                styles.push(new ol.style.Style({
                    geometry: new ol.geom.Point(arraw_coor),
                    image: new ol.style.Icon({
                        src: '../../image/icon-arrow.png',
                        anchor: [0.75, 0.5],
                        rotateWithView: true,
                        rotation: -arrow_rotation
                    })
                }));
            }
            return styles;
        },

        // 根据多点绘制轨迹路径
        drawOribitRoute: function(pointList, name) {
            var sourcename = name ? name + 'OrbitSource' : 'lineOrbitSource'
            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(pointList)
            })
            this[sourcename].addFeature(feature);
        },

        // 车辆轨迹绘制
        drawCarTrajectory: function(options) {
            let _this = this;
            var sourcename = options.name ? options.name + 'OrbitSource' : 'lineOrbitSource';
            // var layername = name ? name + 'OrbitLayer' : 'lineOrbitLayer';
            var feature = this[sourcename].getFeatures()[0];
            var geometry = feature.getGeometry();
            var length = geometry.getLength();
            var curCount = this.curCount || 0;
            var meterLength = Math.round(length * 100 * 1000)
            speed = (options.speed || 1) * 1;

            var carAniCount = parseInt(meterLength / speed);

            var treeRoute = new RBush();

            geometry.forEachSegment(function(start, end) {
                var dx = end[0] - start[0];
                var dy = end[1] - start[1];

                //计算每个segment的方向，即箭头旋转方向
                var rotation = Math.atan2(dy, dx);
                var geom = new ol.geom.LineString([start, end]);
                var extent = geom.getExtent();
                var item = {
                    minX: extent[0],
                    minY: extent[1],
                    maxX: extent[2],
                    maxY: extent[3],
                    geom: geom,
                    rotation: rotation
                };
                treeRoute.insert(item);
            });

            this.animate = setInterval(function() {
                curCount++
                var arraw_coor = geometry.getCoordinateAt(curCount * 1.0 / carAniCount);
                var tol = 0.0001;
                var arraw_coor_buffer = [arraw_coor[0] - tol, arraw_coor[1] - tol, arraw_coor[0] + tol, arraw_coor[1] + tol];
                var treeSearch = treeRoute.search({
                    minX: arraw_coor_buffer[0],
                    minY: arraw_coor_buffer[1],
                    maxX: arraw_coor_buffer[2],
                    maxY: arraw_coor_buffer[3]
                });
                var arrow_rotation;
                if(treeSearch.length == 1) {
                    arrow_rotation = treeSearch[0].rotation;
                } else if (treeSearch.length > 1) {
                    var results = treeSearch.filter(function(item) {

                        //换一种方案，设置一个稍小的容差，消除精度问题
                        var _tol = 0.00001; //消除精度误差的容差
                        if (item.geom.intersectsExtent([arraw_coor[0] - _tol, arraw_coor[1] - _tol, arraw_coor[0] + _tol, arraw_coor[1] + _tol]))
                            return true;
                    })
                    if (results.length > 0)
                        arrow_rotation = results[0].rotation;
                }
                //计算车辆的位置和角度后  改变车辆的位置和角度
                if(options.callback) options.callback(arraw_coor, -arrow_rotation)
                if(curCount + 1 >= carAniCount) {
                    clearInterval(_this.animate);
                }
                _this.curCount = curCount;
            }, 10)


        },

        // 车辆轨迹
        initMapTrajectory: function() {
            //中间站
            var stops=[
                [12909554.6597,4933234.84552],   //14
                [12909824.6852,4931594.7854],    //43
                [12910026.8837,4930523.89946],   //63
                [12910870.563,4929357.26511]     //85
            ];

            var stopMakers = new Array();

            for(var i=0;i<4;i++){
                var s = new ol.Feature({
                    type: 'stop',
                    geometry: new ol.geom.Point(stops[i])
                });
                stopMakers.push(s);
            }
            //将离散点构建成一条折线
            var route = new ol.geom.LineString(stopMakers);
            //获取直线的坐标
            var routeCoords = route.getCoordinates();
            var routeLength = routeCoords.length;

            var routeFeature = new ol.Feature({
                type: 'route',
                geometry: route
            });
            var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var startMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var endMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[routeLength - 1])
            });

            var style = {
                'route': new ol.style.Style({
                      stroke: new ol.style.Stroke({
                          width: 6,
                          color: '#F2C841'
                      }),
                      fill:new ol.style.Fill({
                          color:"#F6E3A3"
                      })
                  }),
                  'geoMarker': new ol.style.Style({
                      /*image: new ol.style.Circle({
                          radius: 7,
                          snapToPixel: false,
                          fill: new ol.style.Fill({ color: 'black' }),
                          stroke: new ol.style.Stroke({
                              color: 'white',
                              width: 2
                          })
                      })*/
                      image: new ol.style.Icon({
                          src: '../../image/ordinary_car.png',
                          rotateWithView: false,
                          // rotation: -Math.atan2(routeCoords[0][1]-routeCoords[1][1], routeCoords[0][0]-routeCoords[1][0]),
                          scale:0.3,
                      })
                  }),
                  'stop':new ol.style.Style({
                      image:new ol.style.Circle({
                          radius:10,
                          snapToPixel:false,
                          fill:new ol.style.Fill({ color:'red'}),
                          stroke:new ol.style.Stroke({
                              color:'white',
                              width:2
                          })
                      })
                  })
            };
            console.log(1123);
            var animating = false;
            var vectorLayer = new ol.layer.Vector({
                id:'carLayer',
                source: new ol.source.Vector({
                    features: [routeFeature, geoMarker, startMarker, endMarker,stopMakers[0],stopMakers[1],stopMakers[2],stopMakers[3]]
                }),
                style: function (feature) {
                    //如果动画是激活的就隐藏geoMarker
                    if (animating && feature.get('type') === 'geoMarker') {
                        return null;
                    }
                    return styles[feature.get('type')];
                }
            });

            this.map.addLayer(vectorLayer);
        }
    }
    window.Map = Map;
})(window);

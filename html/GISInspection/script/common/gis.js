// 初始化地图
// var map = {};

// this.addMember(this.memberList);
//
;
(function(window) {
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

        /** 向地图中添加悬浮元素
         * layObj 悬浮元素需要的数据
         * name  悬浮元素需要作为对象存储的名称及类名的名称依据  非必填
         * position 二位数据  悬浮位置的数组列表 必填 如：[[106.54258025120019,29.561620073599133],[106.54258025120019,29.561620073599133]]
         * isShow 是否一开始就添加到地图中   true为是  false 后期添加  默认为true
         * centerPosition  是否默认需要将地图定位到居中位置  是传入居中位置[经度， 维度]  非必传
         * dom  标签id除了序号的名称 比如  aa-0 传入#aa  序号在id中必须有的  从0开始
         */
        addOverLayer: function(layObj) {
            layObj = Object.assign({}, {
                name: 'anchor',
                positioning: 'center-center',
                isShow: true
            }, layObj)
            var locationList = layObj.position
            var dom = layObj.dom;
            for (var i = 0; i < locationList.length; i++) {
                layObj.position = locationList[i];
                layObj.dom = dom + '-' + i
                layObj.index = i
                this.addOverLayerEvent(layObj)
            }
            if (layObj.centerPosition) {
                this.map.getView().setCenter(layObj.centerPosition);
            }
        },

        addOverLayerEvent: function(layObj) {
            var name = layObj.name;
            var index = layObj.index;
            var elDom = document.querySelector(layObj.dom);
            layObj = Object.assign({}, {
                positioning: 'center-center',
                className: 'customer-' + name + ' ' + 'customer-' + name + '-' + index,
                element: elDom
            }, layObj);
            var overlayEl = new window.ol.Overlay(layObj);
            this[name] = {...this[name],
                [index + '']: overlayEl
            }
            layObj.isShow ? this.map.addOverlay(overlayEl) : '';
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
                    lineDash: [2, 4],
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
                source: areaSoure,
                layer: areaLayer
            }
            this.map.addLayer(areaLayer);
        },

        // 初始化管点 管线图层
        initDeviceLayer: function(name) {
            var layername = name ? name + 'PointLayer' : 'selectPointLayer'
            var sourcename = name ? name + 'PointSource' : 'selectPointSource'
            var selectPointStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                    color: 'rgba(250, 175, 25, 0.6)'
                }),
                stroke: new window.ol.style.Stroke({
                    color: 'rgba(255, 255, 255, 0.5)',
                    width: 1
                })
            })
            var selectPointSource = new window.ol.source.Vector({});
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

            var selectLineStyle = new window.ol.style.Style({
                fill: new window.ol.style.Fill({
                    color: 'rgba(54, 217, 217, 1)'
                }),
                stroke: new window.ol.style.Stroke({
                    color: 'rgba(54, 217, 217, 1)',
                    width: 4
                }),
            })
            var selectLineSource = new window.ol.source.Vector({});
            this[linesource] = selectLineSource;

            var selectLineLayer = new window.ol.layer.Vector({
                source: selectLineSource,
                updateWhileInteracting: true,
                style: selectLineStyle
            });
            this[linelayer] = selectLineLayer;
            this.map.addLayer(selectLineLayer);
        },

        // 初始化人员轨迹图层
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
        // 计算象限 返回象限 比如1为第一象限
        calculateQuad: function(dx, dy) {
            var quad = 1;
            if (dx > 0 && dy > 0) {
                return 1;
            } else if (dx < 0 && dy > 0) {
                return 2;
            } else if (dx < 0 && dy < 0) {
                return 3;
            } else if (dx > 0 && dy < 0) {
                return 4
            }
        },
        // 开启地图点击事件 选中区域 并执行其他操作
        initMapClick: function(callback) {
            var _this = this
            this.map.on('singleclick', function(e) {
                _this.mapClickEvent(e, callback)
            });
        },

        // 点击地图执行的事件  改变点所在的区域的样式 并将其他的样式重置会初始样式
        mapClickEvent: function(e, callback) {
            // var pixel = this.map.getEventPixel(e.originalEvent);
            var featureInfo = this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                return {
                    feature: feature,
                    layer: layer
                };
            });
            if (featureInfo && featureInfo.feature) {

                // 将当前feature的样式改为选中样式
                var feature = featureInfo.feature;
                var property = feature.getProperties(); //获取当前点击区域的属性值，便于查询该区域的任务和工单 （20201029 zxf）
                feature.setStyle(function() {
                        return new window.ol.style.Style({
                            fill: new window.ol.style.Fill({
                                color: 'rgba(11, 120, 230, 0.1)'
                            }),
                            stroke: new window.ol.style.Stroke({
                                lineDash: [2, 4],
                                lineCap: 'square',
                                color: 'rgba(11, 120, 230, 1)',
                                width: 2
                            })
                        });
                    })
                    // 将当前选中的样式
                if (this.selectFeature && this.selectFeature.ol_uid != feature.ol_uid) {
                    this.selectFeature.setStyle(function() {
                        return new window.ol.style.Style({
                            fill: new window.ol.style.Fill({
                                color: 'rgba(153, 153, 153, 0.1)'
                            }),
                            stroke: new window.ol.style.Stroke({
                                lineDash: [2, 4],
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
                this.selectFeature = feature;
                if (callback) callback(property); // 返回选中标的区域的属性值
            }else{
              //20201103 zxf 取消区域选中颜色
              if(this.selectFeature){
                this.selectFeature.setStyle(function() {
                    return new window.ol.style.Style({
                        fill: new window.ol.style.Fill({
                            color: 'rgba(153, 153, 153, 0.1)'
                        }),
                        stroke: new window.ol.style.Stroke({
                            lineDash: [2, 4],
                            lineCap: 'square',
                            color: 'rgba(153, 153, 153, 1)',
                            width: 2
                        })
                    });
                })
              }
              callback(null);

            }
        },

        // 向地图绘制区域
        // areaList区域字符串列表  '经度,纬度;经度,纬度;'
        drawAreaSelect: function(areaList, info) {
            var areainfo = info || {};
            if (typeof areaList == 'string') {
                this.drawSingleArea(areaList, areainfo);
            } else {
                for (var i = 0; i < areaList.length; i++) {
                  if(areaList[i].areaPoint == null){
                    break;
                  }
                    this.drawSingleArea(areaList[i].areaPoint, areainfo, areaList[i])
                }
            }
        },

        // 绘制区域
        drawSingleArea: function(areaPoint, areainfo, areaSingleList) {
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
            // 设置属性值 （20201029 zxf）
            areaFeatye.setProperties({
                areaId: areaSingleList.areaId,
                areaName: areaSingleList.areaName,
                areaPoint: areaSingleList.areaPoint,
                type: areaSingleList.type
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
        getCommonEle: function(deviceInfo, name, callback) {
            var selectFeature = this.selectFeature;
            var polygon = selectFeature.getGeometry();
            var _this = this;
            // 获取选中的图层边界点
            var areaExtent = deviceInfo.areaPoint.split(';').join(' ');
            areaExtent = areaExtent.substring(0, areaExtent.length - 1);
            this.getDeviceList({
                data: {
                    coords: areaExtent
                },
                success: function(ret) {
                    _this.getLineListInArea(ret.result.line, deviceInfo, name);
                    _this.getPointListInArea(ret.result.point, deviceInfo, name);
                    _this.LineAndPointselectSingleClick(callback);
                }
            })
        },
        getDeviceList: function(options) {
            reqOptions = Object.assign({}, options, {
                url: gisUrl + 'SearchPipe/GetPipeByExtent',
                type: 'get',
                timeout: 30,
                data: options.data,
                error: function(err) {
                    if (options.fail) options.fail(err);
                },
                success: function(ret) {
                    options.success(ret);
                }
            })
            ajaxMethod(reqOptions);
        },
        // 根据数据返回的管线 判断是否在传入的区域内 并绘制在区域内的管线
        getLineListInArea: function(allLineList, deviceInfo, name) {
            var checkedLine = deviceInfo.lineList;
            var lineList = [];
            for (var i = 0; i < checkedLine.length; i++) {
                for (var j = 0; j < allLineList.length; j++) {
                    if (checkedLine[i].deviceCode == allLineList[j].lineNumber) {
                        var flats = allLineList[j].geom.match(/LINESTRING\((.*)\)/)[1].split(',');
                        var coordinates = []
                        for (var k = 0; k < flats.length; k++) {
                            coordinates.push(flats[k].split(' '))
                        }
                        let x = (Number(coordinates[0][0]) + Number(coordinates[1][0])) / 2;
                        let y = (Number(coordinates[0][1]) + Number(coordinates[1][1])) / 2;
                        // 管线信息 (zxf 20201030)
                        lineList.push({
                            deviceCode: allLineList[j].lineNumber,
                            deviceName: allLineList[j].material,
                            devicePoint: x + ',' + y,
                            address: allLineList[j].location,
                            deviceLoaction: coordinates,
                            id: checkedLine[i].id,
                            typeStr: checkedLine[i].typeStr,
                            status: checkedLine[i].status,
                            statusStr: checkedLine[i].statusStr,
                            type: checkedLine[i].type,
                            areaType: deviceInfo.areaType,
                            taskId: deviceInfo.taskId,
                            workOrderId: checkedLine[i].workOrderId,
                            workOrderStatus: checkedLine[i].workOrderStatus,
                            workOrderType: checkedLine[i].workOrderType,
                            workOrderTypeStr: checkedLine[i].workOrderTypeStr,
                        });
                        break;
                    }
                }
            }
            this.drawLineSelect(lineList, name);
        },

        // 根据数据返回的管点 判断是否在传入的区域内 并绘制在区域内的管点
        getPointListInArea: function(allPointList, deviceInfo, name) {
            var checkedPoint = deviceInfo.pointList;
            var pointList = [];
            for (let i = 0; i < checkedPoint.length; i++) {
                for (let j = 0; j < allPointList.length; j++) {
                    if (checkedPoint[i].deviceCode == allPointList[j].pointNumbe) {
                        var coordinates = allPointList[j].geom.match(/POINT\((.*)\)/)[1];
                        // 管点信息 (zxf 20201030)
                        pointList.push({
                            deviceCode: allPointList[j].pointNumbe,
                            deviceName: allPointList[j].pointName,
                            devicePoint: coordinates.split(' ').join(','),
                            address: allPointList[j].location,
                            deviceLoaction: coordinates.split(' '),
                            id: checkedPoint[i].id,
                            typeStr: checkedPoint[i].typeStr,
                            status: checkedPoint[i].status,
                            statusStr: checkedPoint[i].statusStr,
                            type: checkedPoint[i].type,
                            areaType: deviceInfo.areaType, //区域；类型，用于区分设备跳转到相应的页面
                            taskId: deviceInfo.taskId,
                            workOrderId: checkedPoint[i].workOrderId,
                            workOrderStatus: checkedPoint[i].workOrderStatus,
                            workOrderType: checkedPoint[i].workOrderType,
                            workOrderTypeStr: checkedPoint[i].workOrderTypeStr,
                        });
                        break;
                    }
                }
            }
            this.drawPointSelect(pointList, name);
        },
        // 选中管线
        drawLineSelect: function(selectLineList, name) {
            var linesource = name ? name + 'LineSource' : 'selectLineSource'
            for (let i = 0; i < selectLineList.length; i++) {
                let lineFeatype = new window.ol.Feature({
                    geometry: new window.ol.geom.Polygon([selectLineList[i].deviceLoaction])
                });
                // 设置属性(zxf 20201030)
                lineFeatype.setProperties({
                    deviceCode: selectLineList[i].deviceCode,
                    deviceName: selectLineList[i].deviceName,
                    devicePoint: selectLineList[i].devicePoint,
                    address: selectLineList[i].address,
                    deviceLoaction: selectLineList[i].deviceLoaction,
                    id: selectLineList[i].id,
                    typeStr: selectLineList[i].typeStr,
                    status: selectLineList[i].status,
                    statusStr: selectLineList[i].statusStr,
                    type: selectLineList[i].type,
                    areaType: selectLineList[i].areaType,
                    taskId: selectLineList[i].taskId,
                    workOrderId: selectLineList[i].workOrderId,
                    workOrderStatus: selectLineList[i].workOrderStatus,
                    workOrderType: selectLineList[i].workOrderType,
                    workOrderTypeStr: selectLineList[i].workOrderTypeStr,
                });
                this[linesource].addFeature(lineFeatype);
            }
        },

        // 选中管点
        drawPointSelect: function(selectPointList, name) {
            var pointsource = name ? name + 'PointSource' : 'selectPointSource';
            for (let i = 0; i < selectPointList.length; i++) {
                let pointFeatype = new window.ol.Feature({
                    geometry: new window.ol.geom.Circle([Number(selectPointList[i].deviceLoaction[0]), Number(selectPointList[i].deviceLoaction[1])], 0.00005)
                });
                // 设置属性(zxf 20201030)
                pointFeatype.setProperties({
                    deviceCode: selectPointList[i].deviceCode,
                    deviceName: selectPointList[i].deviceName,
                    devicePoint: selectPointList[i].devicePoint,
                    address: selectPointList[i].address,
                    deviceLoaction: selectPointList[i].deviceLoaction,
                    id: selectPointList[i].id,
                    typeStr: selectPointList[i].typeStr,
                    status: selectPointList[i].status,
                    statusStr: selectPointList[i].statusStr,
                    type: selectPointList[i].type,
                    areaType: selectPointList[i].areaType,
                    taskId: selectPointList[i].taskId,
                    workOrderId: selectPointList[i].workOrderId,
                    workOrderStatus: selectPointList[i].workOrderStatus,
                    workOrderType: selectPointList[i].workOrderType,
                    workOrderTypeStr: selectPointList[i].workOrderTypeStr,
                });
                this[pointsource].addFeature(pointFeatype);
            }
        },
        LineAndPointselectSingleClick: function(callback) { // 获取页面选择属性(zxf 20201030)
            var LineselectSingleClick = new ol.interaction.Select({
                hitTolerance: 1
            });
            this.map.addInteraction(LineselectSingleClick);
            LineselectSingleClick.on('select', function(e) {
                var features = e.target.getFeatures().getArray();
                if (features.length > 0) {
                    var feature = features[0];
                    var property = feature.getProperties();
                    if (callback) callback(property);
                } else {
                    callback(null);
                }
            });
        },
        // 根据多点绘制路径
        drawOribitRoute: function(pointList, name) {
            var sourcename = name ? name + 'OrbitSource' : 'lineOrbitSource'
            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(pointList)
            })

            this[sourcename].addFeature(feature);

            // var coordinates = []
            // for(var i = 0; i< pointList.length; i++) {
            //     pointList
            // }
            // var coordinates = [];
            // for( var i = 0; i < pointList.length; i++) {
            //     var point = pointList[i].Location.split(',')
            //     coordinates.push([Number(point[0]), Number(point[1])])
            // }
            // console.log(coordinates)
        },

        // 改变地图的缩放  isScale 表示放大还是缩小  0表示缩小  1表示放大
        changeAreaScale: function(isScale) {
            var zoom = this.zoomMap;
            if (isScale) {
                zoom++;
            } else {
                zoom--;
            }
            zoom = zoom <= 18 ? zoom : 18;
            zoom = zoom >= 5 ? zoom : 5;
            this.zoomMap = zoom;
            this.map.getView().setZoom(zoom);
        },
        drawArea: function(callback) { //2020-11-3 zxf
            // 绘图的颜色
            var drawStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#00F5B4',
                    width: 3,
                    // lineDash: [2, 2, 2, 2, 2, 2, ]
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(113, 128, 248, 0.5)'
                })
            })
            var measureLayer = new ol.layer.Vector({
                source: new ol.source.Vector,
                style: drawStyle
            });
            measureLayer.set('name', 'measureLayer');
            this.map.addLayer(measureLayer);
            var measureDraw = new ol.interaction.Draw({
                type: 'Polygon',
                source: measureLayer.getSource(), // 注意设置source，这样绘制好的线，就会添加到这个source里
                style: new ol.style.Style({ // 设置绘制时的样式
                    stroke: new ol.style.Stroke({
                        color: '#00F5B4',
                        width: 1,
                    })
                }),
                // maxPoints: 2 // 限制不超过4个点
            });
            var _this = this;
            measureDraw.on('drawend', function(event) {
                var coordinates = JSON.parse(JSON.stringify(event.feature.getGeometry().getCoordinates()));
                callback(coordinates);
                _this.map.removeInteraction(measureDraw); //取消绘制
            });
            // 为地图添加一个绘图交互
            this.map.addInteraction(measureDraw);
        },
        renderAllPersionToMap(paramers, callback) { //领导页面添加多个人员 2020-11-3 zxf
            var allPersondLayer = new ol.layer.Vector({
                source: new ol.source.Vector({}),
            });
            var source = allPersondLayer.getSource();
            for (let i = 0; i < paramers.length; i++) {
                var FeatureImage = '../../image/offline_location.png';
                if (paramers[i].isOnline == true || paramers[i].isOnline == 'true' && paramers[i].isOnline != null) {
                    FeatureImage = '../../image/location.png';
                }
                var allPersondLayerFeature = new ol.Feature({
                    geometry: new ol.geom.Point(paramers[i].location),
                });
                allPersondLayerFeature.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.4,
                        src: FeatureImage
                    })
                }));
                allPersondLayerFeature.setProperties({
                    userId: paramers[i].userId,
                    userName: paramers[i].userName,
                    mobile: paramers[i].mobile,
                    isOnline: paramers[i].isOnline,
                    onlineTime: paramers[i].onlineTime,
                    offlineTime: paramers[i].offlineTime,
                    location: paramers[i].location,
                    workOrderLists: paramers[i].workOrderLists,
                    taskLists: paramers[i].taskLists,
                });

                source.addFeature(allPersondLayerFeature);
            }
            this.map.addLayer(allPersondLayer);
            this.LineAndPointselectSingleClick(callback); //选择了地图上的元素
        },
        addOverlayToMap: function(location) { // 2020-11-3 zxf
            var popup = new window.ol.Overlay({
                element: document.getElementById('personDetail_popup'),
                position: location,
                offset: [-83, -72],
                positioning: 'bottom-center',
            });
            this.map.addOverlay(popup);
            $('#personDetail_popup').show();
        },
        // 点击地图区域返回区域信息  2020-10-28  -zlx
      mapClickArea: function(callback) {
          // 点击区域的定点坐标
          var coordinates = [];
          this.map.on('singleclick', function(e) {
            var pixel = this.map.getEventPixel(e.originalEvent);
            var featureInfo = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                var geometry = feature.getGeometry();
                coordinates = geometry.getCoordinates();
                return {feature:feature,layer:layer};
            });
            this.mapHighlight(featureInfo.feature);
            callback(coordinates);
          }, this);
      },

      // 地图设置高亮显示  2020-10-28  -zlx
      mapHighlight: function(feature) {
        if(feature) {
            // 将当前feature的样式改为选中样式
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

      // 高亮显示选择  2020-10-28  -zlx
      // areaPoint 片区坐标 ['104.15243983268738','30.024197101593018']
      mapCheckedArea: function(areaPoint, areainfo) {
        var name = areainfo.name || 'area'
        var sourceName = name + 'source';
        (JSON.stringify(areaPoint));
        var feature = this[sourceName]['source'].getClosestFeatureToCoordinate(areaPoint);
        this.mapHighlight(feature);

        var geometry = feature.getGeometry();
        var coordinates = geometry.getCoordinates();
        var areaPointsArr = coordinates[0];
        var pointsArray = new Array();
        let xArray = new Array();
        let yArray = new Array();
        for (let i = 0; i < areaPointsArr.length - 1; i++) {
            pointsArray.push(areaPointsArr[i]);
            xArray.push(areaPointsArr[i][0]);
            yArray.push(areaPointsArr[i][1]);
        }
        var xmax = Math.max.apply(null, xArray);
        var xmin = Math.min.apply(null, xArray);
        var ymax = Math.max.apply(null, yArray);
        var ymin = Math.min.apply(null, yArray);
        this.map.getView().fit([xmin, ymin, xmax, ymax]);
      },

      // 清空地图上区域  2020-10-29  -zlx
      mapClearSource: function(areainfo) {
        var name = areainfo.name || 'area'
        var sourceName = name + 'source';
        this[sourceName]['source'].clear();

        var pointsource = areainfo.name ? areainfo.name + 'PointSource' : 'selectPointSource';
        var linesource = areainfo.name ? areainfo.name + 'LineSource' : 'selectLineSource';
        this[pointsource].clear();
        this[linesource].clear();
        this.map.removeLayer(pointsource);
        this.map.removeLayer(linesource);
      },

      // 地图显示管线  设备点 2020-10-29  -zlx
      mapConduitEquipment: function(deviceInfo, areainfo) {
          var name = areainfo.name || 'area'
          var sourceName = name + 'source';
          var areaPointArr = deviceInfo.areaPoint.split(';');
          var areaPoint = areaPointArr[0].split(',');
          var feature = this[sourceName]['source'].getClosestFeatureToCoordinate(areaPoint);
          var polygon = feature.getGeometry();
          var _this = this;
          // 获取选中的图层边界点
          var areaExtent = deviceInfo.areaPoint.split(';').join(' ');
          areaExtent = areaExtent.substring(0, areaExtent.length - 1);
          this.getDeviceList({
              data: {
                  coords: areaExtent
              },
              success: function(ret) {
                _this.getLineListInArea(ret.result.line, deviceInfo.lineList, name)
                _this.getPointListInArea(ret.result.point, deviceInfo.pointList, name)
              }
          })
      },

      // 初始化划分区域图层
      initDivide: function() {
          // 区域数据源
          var areaSoure = new window.ol.source.Vector({});
          // 绘图的颜色
          var drawStyle = new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: '#00F5B4',
                  width: 3,
              }),
              fill: new ol.style.Fill({
                  color: 'rgba(113, 128, 248, 0.5)'
              })
          });
          // 区域图层
          var areaLayer = new window.ol.layer.Vector({
              source: areaSoure,
              updateWhileInteracting: true,
              style: drawStyle
          });
          this['measureLayer'] = {
              source : areaSoure,
              layer : areaLayer
          }
          this.map.addLayer(areaLayer);
      },

      mapToLine: function(isClick, isSave, addareaPoint, measureDraw, callback){
        if (!isClick) {
          callback({measureDraw: '', isSave: false});
          this.map.removeInteraction(measureDraw); //取消绘制
          return false;
        }
        if (measureDraw == '') {
          measureDraw = new ol.interaction.Draw({
            type: 'Polygon',
            source: this['measureLayer']['source'], // 注意设置source，这样绘制好的线，就会添加到这个source里
            style: new ol.style.Style({ // 设置绘制时的样式
              stroke: new ol.style.Stroke({
                color: '#00F5B4',
                width: 3,
              })
            }),
            minPoints: 3
          });
        }
        var _this = this;
        var coordinates = [];
        measureDraw.on('drawstart', function(event) {
            isSave = true;
            callback({measureDraw: measureDraw, isSave: isSave});
        });

        this.map.addInteraction(measureDraw);
        callback({measureDraw: measureDraw, isSave: isSave});
     },

     mapRemoveInteraction: function(measureDraw, addareaPoint, callback) {
       if (addareaPoint.length > 0) {
         this['measureLayer']['source'].clear();
         this['areaDividePointSource'].clear();
         this['areaDivideLineSource'].clear();
       } else {
         measureDraw.abortDrawing_();
       }
       this.mapToLine(true, false, [], measureDraw, function(ret) {
         callback(ret);
       });
     },

     mapSaveArea: function(measureDraw, callback) {
       var _this = this;
       var coordinates = [];
       measureDraw.on('drawend', function(event) {
          coordinates = JSON.parse(JSON.stringify(event.feature.getGeometry().getCoordinates()));
          if (coordinates[0].length > 2) {
            _this.map.removeInteraction(measureDraw); //取消绘制
          }
       });
       measureDraw.finishDrawing();
       callback({coordinates: coordinates, measureDraw: measureDraw});
     },

     showPointLine: function(pointList, lineList, name) {
       var pointArr = [];
       var lineArr = [];

       console.log(JSON.stringify(pointList));
       for (var i = 0; i < pointList.length; i++) {
         var coordinates = pointList[i].geom.match(/POINT\((.*)\)/)[1];
         pointArr.push({
             deviceCode: pointList[i].pointNumbe,
             deviceName: pointList[i].pointName,
             devicePoint: coordinates.split(' ').join(','),
             address: pointList[i].location,
             deviceLoaction: coordinates.split(' ')
         });
       }
       this.drawPointSelect(pointArr, name);

       for (var i = 0; i < lineList.length; i++) {
         var flats = lineList[i].geom.match(/LINESTRING\((.*)\)/)[1].split(',');
         var coordinates = []
         for(var k = 0; k < flats.length; k++) {
             coordinates.push(flats[k].split(' '))
         }
         let x = (Number(coordinates[0][0]) + Number(coordinates[1][0])) / 2;
         let y = (Number(coordinates[0][1]) + Number(coordinates[1][1])) / 2;
         lineArr.push({
             deviceCode: lineList[i].lineNumber,
             deviceName: lineList[i].material,
             devicePoint: x + ',' + y,
             address: lineList[i].location,
             deviceLoaction: coordinates,
         });
       }
       this.drawLineSelect(lineArr, name);
     },

    }
    window.Map = Map;
})(window);

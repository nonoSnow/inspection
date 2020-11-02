

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
          (this[sourceName])
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

        // 清空地图上区域
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

        // 地图显示管线  设备点
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
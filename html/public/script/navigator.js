(function(window) {
    /**
     * @method 初始化地图
     * @param  options 参数（目的地的经纬度,数组方式）
     */
    function Navigator(options) {
        this.init(options);
    }
    Navigator.prototype = {
        // 初始化地图
        init: function(options) {
            this.targetCoordinate = options;
            this.navigator = api.require('navigator');
            if (api.systemType == 'ios') {
                this.MapNavigation('appleMap');
            } else {
                // 百度地图
                this.ifInstalled('bMap');
            }
        },
        ifInstalled: function(mapName) { //判断是否安装了第三方地图 （百度，高德）
          var _this = this;
            this.navigator.installed({
                target: mapName
            }, function(ret, err) {
                if (ret.status) {
                    _this.MapNavigation(mapName);
                } else {
                  if(mapName == "aMap"){
                    api.toast({
                        msg: '请安装高德地图或者百度地图!',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                  }
                    _this.ifInstalled('aMap');
                }
            });
        },
        MapNavigation: function(type) {
          var startLon = null,
              startLat = null,
              startName = null,
              endName = null;
              var _this = this;
          var bMap = api.require('bMap');
          bMap.getLocation({
              accuracy: '100m',
              autoStop: true,
              filter: 1
          }, function(ret, err) {
              if (ret.status) {
                  startLon = ret.lon;
                  startLat = ret.lat;
                  bMap.getNameFromCoords({
                      lon: startLon,
                      lat: startLat
                  }, function(ret, err) {
                      if (ret.status) {
                          startName = ret.address; //获取起点的坐标名字
                          bMap.getNameFromCoords({
                              lon: _this.targetCoordinate[0],
                              lat: _this.targetCoordinate[1]
                          }, function(ret, err) {
                              if (ret.status) {
                                  endName = ret.address;
                                  if (type == 'bMap') {
                                      var mapInfoDatas = {
                                          start: { // 起点信息.
                                              lon: startLon, // 经度.
                                              lat: startLat, // 纬度.
                                              name: startName
                                          },
                                          end: { // 终点信息.
                                              lon: _this.targetCoordinate[0], // 经度
                                              lat: _this.targetCoordinate[1], // 纬度
                                              name: endName
                                          },
                                          mode: 'driving'
                                      };
                                      _this.navigator.bMapNavigation(mapInfoDatas);
                                  } else if (type == 'aMap') {
                                      var mapInfoDatas = {
                                          start: { // 起点信息.
                                              lon: startLon, // 经度.
                                              lat: startLat, // 纬度.
                                              name: startName
                                          },
                                          end: { // 终点信息.
                                              lon: _this.targetCoordinate[0], // 经度
                                              lat: _this.targetCoordinate[1], // 纬度
                                              name: endName
                                          },
                                          mode: 'driving'
                                      };
                                      _this.navigator.aMapPath(mapInfoDatas);
                                  } else if (type == 'appleMap') {
                                      var mapInfoDatas = {
                                          start: { // 起点信息.
                                              lon: startLon, // 经度.
                                              lat: startLat, // 纬度.
                                              name: startName
                                          },
                                          end: { // 终点信息.
                                              lon: _this.targetCoordinate[1], // 经度
                                              lat: _this.targetCoordinate[1], // 纬度
                                              name: endName
                                          },
                                          mode: 'driving'
                                      };
                                      _this.navigator.appleNavigation(mapInfoDatas);
                                  }
                              }
                          });
                      }
                  });
              }
          });
        }
    };
    window.Navigator = Navigator;
})(window);

/**
* @method getMemberLocation 获取用户当前位置
*/
function getMemberLocation(callback) {
    // 判断用户是否开启GPS
    getLocationGPS(function() {
        // 开启了GPS后  定位用户的位置
        var bMap = api.require("bMap");
        bMap.getLocation({
            accuracy: '10m',
            autoStop: true,
            filter: 1
        }, function(ret, err) {
            if (ret.status) {
                var location = bd09towgs84(ret.lon, ret.lat);
                callback(location)
            } else {
                alert(err.code);
            }
        })
    })
}

/**
* @method getLocationGPS 获取是否打开了GPS
*/
function getLocationGPS(callback) {
    var gpsmodel = api.require('gpsState');
    gpsmodel.gpsstate(function(ret) {
        if(ret.gps == true) {
            callback();
        } else {
            if (api.systemType == 'android') {
                gpsmodel.opengps();
            }
            if (api.systemType == 'ios') {
                var setJumpNew = api.require('setJumpNew');
                setJumpNew.open();
            }
        }
    })
}

/**
* 将获取的用户位置由百度地图坐标（bd09togcj02）转为天地图坐标（wgs84）
*/
(function(window) {
    var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    function bd09togcj02(bd_lon, bd_lat) {
      var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
      var x = bd_lon - 0.0065;
      var y = bd_lat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      var gg_lng = z * Math.cos(theta);
      var gg_lat = z * Math.sin(theta);
      return [gg_lng, gg_lat];
    }

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function gcj02towgs84(lng, lat) {
      lng = parseFloat(lng);
      lat = parseFloat(lat);
      if (out_of_china(lng, lat)) {
        return [lng, lat];
      } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = (lat / 180.0) * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
      }
    }

    /**
     * 百度坐标（BD-09） 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
     function bd09towgs84(bd_lon, bd_lat) {

         var location = bd09togcj02(bd_lon, bd_lat);
         location = gcj02towgs84(location[0], location[1]);

         return location;
     }

     function transformlat(lng, lat) {
       var ret =
         -100.0 +
         2.0 * lng +
         3.0 * lat +
         0.2 * lat * lat +
         0.1 * lng * lat +
         0.2 * Math.sqrt(Math.abs(lng));
       ret +=
         ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
           2.0) /
         3.0;
       ret +=
         ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
         3.0;
       ret +=
         ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
           2.0) /
         3.0;
       return ret;
     }

     function transformlng(lng, lat) {
       var ret =
         300.0 +
         lng +
         2.0 * lat +
         0.1 * lng * lng +
         0.1 * lng * lat +
         0.1 * Math.sqrt(Math.abs(lng));
       ret +=
         ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
           2.0) /
         3.0;
       ret +=
         ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
         3.0;
       ret +=
         ((150.0 * Math.sin((lng / 12.0) * PI) +
           300.0 * Math.sin((lng / 30.0) * PI)) *
           2.0) /
         3.0;
       return ret;
     }

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    function out_of_china(lng, lat) {
      return (
        lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
      );
    }



    window.bd09togcj02 = bd09togcj02;
    window.gcj02towgs84 = gcj02towgs84;
    window.bd09towgs84 = bd09towgs84;

})(window)

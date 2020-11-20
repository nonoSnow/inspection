// 请求后台接口地址
// var baseUrl = 'http://' + $api.getStorage('apiUrl') + '/';
var baseUrl = 'http://' + $api.getStorage('apiUrl') + '/';
// var baseUrl = 'http://192.168.9.44:9090/';
// console.log(baseUrl);
var requestUrl = baseUrl + 'api/services/Inspection/';

var appUrl = baseUrl + 'api/services/app/';

var gisUrl = baseUrl + 'api/services/SNTGIS/';
// var gisUrl = 'http://192.168.9.44:9090/api/services/SNTGIS/'
// 管网管线获取地址
// const mapwms = 'http://118.122.84.146:8595/geoserver/OpenGIS/wms';
const mapwms = 'http://221.226.213.42:8595/geoserver/OpenGIS/wms';
const workSpace = 'http://www.OpenGIS.com/OpenGIS';

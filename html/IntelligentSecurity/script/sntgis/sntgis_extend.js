//各种集合
var SNTGIS = {};
SNTGIS.layer = {};
SNTGIS.NetWork = {};
SNTGIS.userName = '';
SNTGIS.passWord = '';
SNTGIS.workSpace = '';

//通用方法封装
// 移除地图所有图层
ol.Map.prototype.removeAllLayers = function () {
    this.setLayerGroup(new ol.layer.Group());
};

//判断图层是否在地图中
ol.Map.prototype.isLayerInMap = function (layerName) {
    var layerList = this.getLayers().array_;
    for (var index = 0; index < layerList.length; index++) {
        var layer = layerList[index];
        var layerNameN = layer.values_.layerName;
        if (layerNameN == layerName) {
            return layer
        }
    }
    return false;
};


//地图类创建，参数center, zoom, maxZoom, minZoom, layers, target, extent
SNTGIS.Map = function (obj) {
    var mapOption = {
        zoom: undefined,
        target: undefined,
        extent: undefined,
        layers: undefined,
        center: undefined,
        maxZoom: undefined,
        minZoom: undefined,
    }
    for (var i in mapOption) {
        mapOption[i] = obj[i] || mapOption[i];
    }
    var projection = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'degrees',
        axisOrientation: 'neu',
        global: true,
    });
    return new ol.Map({
        controls: ol.control.defaults({}).extend([]),
        target: mapOption.target,
        layers: mapOption.layers,
        view: new ol.View({
            projection: projection,
            center: mapOption.center,
            maxZoom: mapOption.maxZoom,
            minZoom: mapOption.minZoom,
            zoom: mapOption.zoom,
            extent: mapOption.extent
        })
    })
}


//geojson图层,加密状态
SNTGIS.layer.JsonVector = function (obj) {
    var option = {
        url: undefined,
        style: undefined,
        layerName: undefined
    }
    for (var i in option) {
        option[i] = obj[i] || option[i];
    }
    return new ol.layer.Vector({
        source: getVectorSourceBySecurity(option.url),
        style: option.style,
        layerName: option.layerName
    });
}

//通过加密获取矢量服务
function getVectorSourceBySecurity(url) {
    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var ajax = new XMLHttpRequest();
            ajax.open('get', url);
            ajax.withCredentials = true;
            ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
            ajax.send();
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    vectorSource.addFeatures(
                        vectorSource.getFormat().readFeatures(ajax.responseText));
                }
            };
        }
    });
    return vectorSource;
}



//添加wms图层
SNTGIS.layer.TileWMS = function (obj) {
    var option = {
        url: undefined,
        layers: undefined,
        layerName: undefined
    }
    for (var i in option) {
        option[i] = obj[i] || option[i];
    }
    return new ol.layer.Tile({
        layerName: option.layerName,
        source: new ol.source.TileWMS({
            url: option.url,
            crossOrigin: 'anonymous',
            tileLoadFunction: getWMSSourceBySecurity,
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                "LAYERS": option.layers,
                tiled: true,
                "exceptions": 'application/vnd.ogc.se_inimage',
            }
        })
    });
}

//通过加密获取离线栅格切片服务
function getWMSSourceBySecurity(tile, src) {
    const client = new XMLHttpRequest();
    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', authenticateUser(SNTGIS.userName, SNTGIS.passWord));
    client.onload = function () {
        var arrayBufferView = new Uint8Array(this.response);
        var blob = new Blob([arrayBufferView], { type: 'image/png' });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        tile.getImage().src = imageUrl;
    };
    client.send();
}

//在线天地图的加载方式
SNTGIS.layer.TDMap = function (obj) {
    var option = {
        token: undefined,
        type: undefined,
        layerName: undefined
    }
    for (var i in option) {
        option[i] = obj[i] || option[i];
    }
    var url = '';
    switch (option.type) {
        case 1: //电子底图
            url = "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + option.token
            break;
        case 2: //影像底图
            url = "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + option.token
            break;
        case 3: //地形底图
            url = "http://t4.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=" + option.token
            break;
        case 4: //地名注记
            url = "http://t4.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + option.token
            break;
    }
    return new ol.layer.Tile({
        layerName: option.layerName,
        source: new ol.source.XYZ({
            url: url
        })
    })
}

//访问离线百度地图，需GIS技术人员提前部署切片
SNTGIS.layer.BDMap = function (obj) {
    var option = {
        url: undefined,
        layerName: undefined
    }
    for (var i in option) {
        option[i] = obj[i] || option[i];
    }
    return new ol.layer.Tile({
        layerName: option.layerName,
        source: new ol.source.XYZ({
            projection: 'baidu',
            crossOrigin: 'anonymous',
            tileUrlFunction: function (tileCoord) {
                var x = tileCoord[1];
                var y = tileCoord[2];
                var z = tileCoord[0];
                return option.url + z + '/' + x + '/' + y + '.png'
            },
            tileGrid: new ol.tilegrid.TileGrid({
                resolutions: bmercResolutions,
                origin: [0, 0],
                extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
                tileSize: [256, 256]
            })
        })
    });
}

//访问离线谷歌地图，需GIS技术人员提前部署切片
SNTGIS.layer.GoogleMap = function (obj) {
    var option = {
        url: undefined,
        layerName: undefined
    }
    for (var i in option) {
        option[i] = obj[i] || option[i];
    }
    return new ol.layer.Tile({
        layerName: option.layerName,
        source: new ol.source.XYZ({
            url: option.url + '/{z}/{x}/{y}.png',
            projection: 'EPSG:900913',
            crossOrigin: 'anonymous',
        })
    });
}


//根据过滤条件返回geoserver的wms服务中的相关要素
SNTGIS.NetWork.getFeaturesByFilter = function (layer, filter, callback) {
    var source = layer.getSource();
    var url = source.urls[0];
    var layerInfo = source.params_.LAYERS;
    url = url.replace('/wms', '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=KKKMMMSSSEEE&outputFormat=application%2Fjson&CQL_FILTER=' + filter);
    url = url.replace('KKKMMMSSSEEE', layerInfo);
    var ajax = new XMLHttpRequest();
    ajax.open('get', url);
    ajax.withCredentials = true;
    ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            try {
                callback($.parseJSON(ajax.responseText).features)
            } catch (error) {
                console.log(error)
            }
        }
    };
}
//根据坐标点查询wms服务中的相关要素
SNTGIS.NetWork.getFeaturesByCoord = function (layer, coord, view, callback) {
    var source = layer.getSource();
    var url = source.getGetFeatureInfoUrl(coord, view.getResolution(), view.getProjection(),
        {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 50
        });
    var ajax = new XMLHttpRequest();
    ajax.open('get', url);
    ajax.withCredentials = true;
    ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            try {
                callback($.parseJSON(ajax.responseText).features)
            } catch (error) {
                console.log(error)
            }
        }
    };
}

//根据坐标串查询所相交的要素集合
SNTGIS.NetWork.getFeaturesByCoords = function (layer, coords, callback) {
    var source = layer.getSource();
    var layerName = source.params_.LAYERS;
    var layerNameArray = layerName.split(":");
    if (layerNameArray.length == 2) {
        var url = source.urls[0].replace('/wms','/wfs');
        url = url.replace('/'+layerNameArray[0],''); //获取服务器wfs服务地址
        var xml = getInsectsOGCXMLFromParams(SNTGIS.workSpace, layerNameArray[0], layerNameArray[1], coords);
        var ajax = new XMLHttpRequest();
        var ajax = new XMLHttpRequest();
        ajax.open('POST', url);
        ajax.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
        ajax.send(xml);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                try {
                    callback($.parseJSON(ajax.responseText).features)
                } catch (error) {
                    console.log(error)
                }
            }
        };
    }
}

//根据geojson的url信息获取范围内的管网信息
SNTGIS.NetWork.getFeaturesByCoords = function (url, coords, layerName,workSpaceName) {
    var xml = getInsectsOGCXMLFromParams(SNTGIS.workSpace, workSpaceName, layerName, coords);
    var ajax = new XMLHttpRequest();
    var ajax = new XMLHttpRequest();
    ajax.open('POST', url);
    ajax.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    ajax.setRequestHeader("Authorization", authenticateUser(SNTGIS.userName, SNTGIS.passWord));
    ajax.send(xml);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            try {
                callback($.parseJSON(ajax.responseText).features)
            } catch (error) {
                console.log(error)
            }
        }
    };
}


//通过参数获取OGC的相交XML访问代码   
//Filter定义了三种操作符：地理操作符（Spatial operators），比较操作符（Comparison operators）和逻辑操作符（Logical operators）。
//Spatial operators定义了地理属性的操作方式，他们有：Equals，Disjoint，Touches，Within，Overlaps，Crosses，Intersects，Contains，DWithin， Beyond，BBOX。
//Comparison operators定义了标量属性的操作方式，他们有：PropertyIsEqualTo，PropertyIsNotEqualTo，PropertyIsLessThan，PropertyIsGreaterThan， PropertyIsLessThanOrEq，PropertyIsGreaterThanO，PropertyIsLike，PropertyIsNull， PropertyIsBetween。
//Logical operators定义了组合这些操作的方式，他们有：And，Or，Not。
function getInsectsOGCXMLFromParams(featureNS, featurePrefix, featureTypes, coords, viewParams) {
    var featString = '<?xml version="1.0" encoding="utf-8"?>'
    featString += '<GetFeature '
    featString += '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    featString += '    xmlns:gml="http://www.opengis.net/gml"'
    featString += '    xmlns:ogc="http://www.opengis.net/ogc" outputFormat="application/json"'
    if (viewParams) {
        featString += '    wfs:viewParams="' + viewParams + '"'
    }
    featString += '    xmlns:wfs="http://www.opengis.net/wfs"'
    featString += '    xmlns="http://www.opengis.net/wfs"'
    featString += '    xmlns:' + featurePrefix + '="' + featureNS + '"'
    featString += '    version="1.0.0" service="WFS" >'
    featString += '    <wfs:Query typeName="' + featurePrefix + ':' + featureTypes + '" srsName="EPSG:4326">'
    featString += '     <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">'
    featString += '      <ogc:Intersects>'
    featString += '  <ogc:PropertyName>geom</ogc:PropertyName>'
    featString += '  <gml:Polygon  srsName="EPSG:4326">'
    featString += '    <gml:outerBoundaryIs>'
    featString += '      <gml:LinearRing>'
    featString += '        <gml:coordinates>' + coords + '</gml:coordinates>'
    featString += '      </gml:LinearRing>'
    featString += '    </gml:outerBoundaryIs>'
    featString += '  </gml:Polygon>'
    featString += '</ogc:Intersects>'
    featString += '     </ogc:Filter>'
    featString += '    </wfs:Query>'
    featString += '</GetFeature>'
    return featString;
}
//加密账号和密码
function authenticateUser(user, password) {
    var token = user + ":" + password;
    var hash = "Basic " + Base64.encode(token);
    return hash;
}
//base64 账号加密
;; (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
            ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
            : typeof global !== 'undefined' ? global
                : this
), function (global) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.4.9";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function (c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                        + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                        + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function (u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function (ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = global.btoa ? function (b) {
        return global.btoa(b);
    } : function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function (u) {
                return (u.constructor === buffer.constructor ? u : buffer.from(u))
                    .toString('base64')
            }
            : function (u) {
                return (u.constructor === buffer.constructor ? u : new buffer(u))
                    .toString('base64')
            }
        : function (u) { return btoa(utob(u)) }
        ;
    var encode = function (u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function (u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function (cccc) {
        switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2))
                );
            default:
                return fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function (b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function (cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [
                fromCharCode(n >>> 16),
                fromCharCode((n >>> 8) & 0xff),
                fromCharCode(n & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function (a) {
        return global.atob(a);
    } : function (a) {
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function (a) {
                return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
            }
            : function (a) {
                return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
            }
        : function (a) { return btou(atob(a)) };
    var decode = function (a) {
        return _decode(
            String(a).replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function () {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function (v) {
            return { value: v, enumerable: false, writable: true, configurable: true };
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () { return global.Base64 });
    }
    // that's it!
    return { Base64: global.Base64 }
}));


//百度地图离线切片访问
var forEachPoint = function (func) {
    return function (input, opt_output, opt_dimension) {
        var len = input.length;
        var dimension = opt_dimension ? opt_dimension : 2;
        var output;
        if (opt_output) {
            output = opt_output;
        } else {
            if (dimension !== 2) {
                output = input.slice();
            } else {
                output = new Array(len);
            }
        }
        for (var offset = 0; offset < len; offset += dimension) {
            func(input, output, offset)
        }
        return output;
    };
};

var sphericalMercator = {}

var RADIUS = 6378137;
var MAX_LATITUDE = 85.0511287798;
var RAD_PER_DEG = Math.PI / 180;

sphericalMercator.forward = forEachPoint(function (input, output, offset) {
    var lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
    var sin = Math.sin(lat * RAD_PER_DEG);

    output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
    output[offset + 1] = RADIUS * Math.log((1 + sin) / (1 - sin)) / 2;
});

sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
    output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
    output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - (Math.PI / 2)) / RAD_PER_DEG;
});


var baiduMercator = {}

var MCBAND = [12890594.86, 8362377.87,
    5591021, 3481989.83, 1678043.12, 0];

var LLBAND = [75, 60, 45, 30, 15, 0];

var MC2LL = [
    [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
        200.9824383106796, -187.2403703815547, 91.6087516669843,
        -23.38765649603339, 2.57121317296198, -0.03801003308653,
        17337981.2],
    [-7.435856389565537e-9, 0.000008983055097726239,
    -0.78625201886289, 96.32687599759846, -1.85204757529826,
    -59.36935905485877, 47.40033549296737, -16.50741931063887,
        2.28786674699375, 10260144.86],
    [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
        59.74293618442277, 7.357984074871, -25.38371002664745,
        13.45380521110908, -3.29883767235584, 0.32710905363475,
        6856817.37],
    [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
        40.31678527705744, 0.65659298677277, -4.44255534477492,
        0.85341911805263, 0.12923347998204, -0.04625736007561,
        4482777.06],
    [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
        23.10934304144901, -0.00023663490511, -0.6321817810242,
        -0.00663494467273, 0.03430082397953, -0.00466043876332,
        2555164.4],
    [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
        7.47137025468032, -0.00000353937994, -0.02145144861037,
        -0.00001234426596, 0.00010322952773, -0.00000323890364,
        826088.5]];

var LL2MC = [
    [-0.0015702102444, 111320.7020616939, 1704480524535203,
    -10338987376042340, 26112667856603880,
    -35149669176653700, 26595700718403920,
    -10725012454188240, 1800819912950474, 82.5],
    [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
        -4082003173.641316, 10774905663.51142, -15171875531.51559,
        12053065338.62167, -5124939663.577472, 913311935.9512032,
        67.5],
    [0.00337398766765, 111320.7020202162, 4481351.045890365,
        -23393751.19931662, 79682215.47186455, -115964993.2797253,
        97236711.15602145, -43661946.33752821, 8477230.501135234,
        52.5],
    [0.00220636496208, 111320.7020209128, 51751.86112841131,
        3796837.749470245, 992013.7397791013, -1221952.21711287,
        1340652.697009075, -620943.6990984312, 144416.9293806241,
        37.5],
    [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
        2485758.690035394, 6070.750963243378, 54821.18345352118,
        9540.606633304236, -2710.55326746645, 1405.483844121726,
        22.5],
    [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
        823725.6402795718, 0.46104986909093, 2351.343141331292,
        1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]];


function getRange(v, min, max) {
    v = Math.max(v, min);
    v = Math.min(v, max);

    return v;
}

function getLoop(v, min, max) {
    var d = max - min;
    while (v > max) {
        v -= d;
    }
    while (v < min) {
        v += d;
    }

    return v;
}

function convertor(input, output, offset, table) {
    var px = input[offset];
    var py = input[offset + 1];
    var x = table[0] + table[1] * Math.abs(px);
    var d = Math.abs(py) / table[9];
    var y = table[2]
        + table[3]
        * d
        + table[4]
        * d
        * d
        + table[5]
        * d
        * d
        * d
        + table[6]
        * d
        * d
        * d
        * d
        + table[7]
        * d
        * d
        * d
        * d
        * d
        + table[8]
        * d
        * d
        * d
        * d
        * d
        * d;

    output[offset] = x * (px < 0 ? -1 : 1);
    output[offset + 1] = y * (py < 0 ? -1 : 1);
}

baiduMercator.forward = forEachPoint(function (input, output, offset) {
    var lng = getLoop(input[offset], -180, 180);
    var lat = getRange(input[offset + 1], -74, 74);

    var table = null;
    var j;
    for (j = 0; j < LLBAND.length; ++j) {
        if (lat >= LLBAND[j]) {
            table = LL2MC[j];
            break;
        }
    }
    if (table === null) {
        for (j = LLBAND.length - 1; j >= 0; --j) {
            if (lat <= -LLBAND[j]) {
                table = LL2MC[j];
                break;
            }
        }
    }
    output[offset] = lng;
    output[offset + 1] = lat;
    convertor(output, output, offset, table);
});

baiduMercator.inverse = forEachPoint(function (input, output, offset) {
    var y_abs = Math.abs(input[offset + 1]);

    var table = null;
    for (var j = 0; j < MCBAND.length; j++) {
        if (y_abs >= MCBAND[j]) {
            table = MC2LL[j];
            break;
        }
    }

    convertor(input, output, offset, table);
});

var gcj02 = {}

var PI = Math.PI;
var AXIS = 6378245.0;
var OFFSET = 0.00669342162296594323;  // (a^2 - b^2) / a^2

function delta(wgLon, wgLat) {
    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((AXIS * (1 - OFFSET)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (AXIS / sqrtMagic * Math.cos(radLat) * PI);
    return [dLon, dLat];
}

function outOfChina(lon, lat) {
    if (lon < 72.004 || lon > 137.8347) {
        return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
        return true;
    }
    return false;
}

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

gcj02.toWGS84 = forEachPoint(function (input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
        var deltaD = delta(lng, lat);
        lng = lng - deltaD[0];
        lat = lat - deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
});

gcj02.fromWGS84 = forEachPoint(function (input, output, offset) {
    var lng = input[offset];
    var lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
        var deltaD = delta(lng, lat);
        lng = lng + deltaD[0];
        lat = lat + deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
});

var bd09 = {}

var PI = Math.PI;
var X_PI = PI * 3000 / 180;

function toGCJ02(input, output, offset) {
    var x = input[offset] - 0.0065;
    var y = input[offset + 1] - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta);
    output[offset + 1] = z * Math.sin(theta);
    return output;
}

function fromGCJ02(input, output, offset) {
    var x = input[offset];
    var y = input[offset + 1];
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    output[offset] = z * Math.cos(theta) + 0.0065;
    output[offset + 1] = z * Math.sin(theta) + 0.006;
    return output;
}

bd09.toWGS84 = function (input, opt_output, opt_dimension) {
    var output = forEachPoint(toGCJ02)(input, opt_output, opt_dimension);
    return gcj02.toWGS84(output, output, opt_dimension);
};

bd09.fromWGS84 = function (input, opt_output, opt_dimension) {
    var output = gcj02.fromWGS84(input, opt_output, opt_dimension);
    return forEachPoint(fromGCJ02)(output, output, opt_dimension);
};


var projzh = {}

projzh.smerc2bmerc = function (input, opt_output, opt_dimension) {
    var output = sphericalMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.fromWGS84(output, output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
};

projzh.bmerc2smerc = function (input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    output = bd09.toWGS84(output, output, opt_dimension);
    return sphericalMercator.forward(output, output, opt_dimension);
};

projzh.bmerc2ll = function (input, opt_output, opt_dimension) {
    var output = baiduMercator.inverse(input, opt_output, opt_dimension);
    return bd09.toWGS84(output, output, opt_dimension);
};

projzh.ll2bmerc = function (input, opt_output, opt_dimension) {
    var output = bd09.fromWGS84(input, opt_output, opt_dimension);
    return baiduMercator.forward(output, output, opt_dimension);
};

projzh.ll2smerc = sphericalMercator.forward;
projzh.smerc2ll = sphericalMercator.inverse;



var extent = [72.004, 0.8293, 137.8347, 55.8271];

var baiduMercatorProj = new ol.proj.Projection({
    code: 'baidu',
    extent: ol.extent.applyTransform(extent, projzh.ll2bmerc),
    units: 'm'
});

ol.proj.addProjection(baiduMercatorProj);
ol.proj.addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);
ol.proj.addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projzh.smerc2bmerc, projzh.bmerc2smerc);

var bmercResolutions = new Array(19);
for (var i = 0; i < 19; ++i) {
    bmercResolutions[i] = Math.pow(2, 18 - i);
}
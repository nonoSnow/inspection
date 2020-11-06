var pageParam;
var indexMap;
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

    pageParam = api.pageParam.deviceInfo;
    $(".pop-container .name").html(pageParam.deviceCode);
    $(".pop-container .location").html(pageParam.devicePoint);
    $(".pop-container .address").html(pageParam.address);
    indexMap = new Map({
        mapid: 'device'
    });
    indexMap.initDeviceLayer('device');
    // pageParam = api.pageParam.deviceInfo;
    // alert(JSON.stringify(pageParam));
    // console.log(JSON.stringify(pageParam))
    $(".pop-boxer").removeClass('aui-hide');

    var position = pageParam.devicePoint.split(',');
    indexMap.addOverLayer({
        name: 'popver',
        position: [position],
        dom: '#poper',
        centerPosition: position,
        // positioning: "top-center"
    })
    indexMap.drawPointSelect([{deviceLoaction: position}], 'device');
}

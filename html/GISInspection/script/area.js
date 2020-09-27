var mapListStatus = 0;

var bodyHeight;
var block;
var oTop = 0;

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    if (api.systemType == 'android') {
      bodyHeight = $('body').height() - 25;
    } else if (api.systemType == 'ios') {
      bodyHeight = $('body').height() - 20;
    }

    onMoveShowList(
      document.getElementById('map-footer'),
      'map-footer',
      $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
      $('.list-item').height() + 0.75 * 20,
      mapListStatus,
      bodyHeight, function(ret){
        console.log(ret);
        mapListStatus = ret;
      });
}

function onShowItem() {
  onShowList('map-footer',
             $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
             $('.list-item').height() + 0.75 * 20,
             mapListStatus,
             bodyHeight,
             function(ret){
                mapListStatus = ret;
             });
}

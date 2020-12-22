
// 设备、管道数据
var pointsArr = lines = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  onGetData();
}

function onGetData() {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var option = {
      url: gisUrl + 'GisStyleIconService/GetStyleIcon',
      type: 'get',
      timeout: 30,
      error: function(err) {
          api.hideProgress();
          console.log(JSON.stringify(err));
      },
      success: function(ret) {
          api.hideProgress();
          // console.log(JSON.stringify(ret));
          var points = ret.result.points;
          var lines = ret.result.lines;
          // console.log(points[1].children.length%4);
          // if (points.length%4 == 0) {
          //
          // }
          // for (var i = 0; i < points.length; i++) {
          //   points[i]
          // }
          // pointsArr = ret.result.points;
          // lines = ret.result.lines;
      }
  };
  ajaxMethod(option);
}

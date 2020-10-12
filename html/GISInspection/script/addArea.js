
apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
}

function onOpenDivide() {
  api.openWin({
      name: 'areaDivide',
      url: './areaDivide.html',
      pageParam: {
          name: 'test'
      }
  });

}

function onOpenLayer() {
  api.openWin({
      name: 'areaLayer',
      url: './areaLayer.html',
      pageParam: {
          name: 'test'
      }
  });

}

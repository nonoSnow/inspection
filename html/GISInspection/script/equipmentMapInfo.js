apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
}

function onOpenReport() {
  api.openWin({
      name: 'addMethodReport',
      url: '../Method/addMethodReport.html',
      pageParam: {
          name: 'test'
      }
  });
}

function onOpenSubmit() {
  api.openWin({
      name: 'taskInfoSubmit',
      url: './taskInfoSubmit.html',
      pageParam: {
          type: 'handle'
      }
  });

}

function onOpenInspectionRecord() {
  api.openWin({
      name: 'inspectionRecord',
      url: '../Method/inspectionRecord.html',
      pageParam: {
          name: 'test'
      }
  });

}

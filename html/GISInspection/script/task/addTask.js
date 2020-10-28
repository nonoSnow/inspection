apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  console.log('已经初始化新增任务了！！！！！！！！');

}

// 进入负责人选择页面
function onOpenHead() {
    api.openWin({
        name: 'headList',
        url: './headList.html'
    });
}

// 初始化开始日期
var rdS = new Rolldate({
    el: '#planStartTime',
    format: 'YYYY-MM-DD hh:mm',
    beginYear: 2000,
    endYear: 2100,
    lang: {
        title: '请选择日期'
    }
})
// 打开开始日期选择
function openStartDate() {
  rdS.show();
}

// 初始化结束日期
var rdE = new Rolldate({
    el: '#planEndTime',
    format: 'YYYY-MM-DD hh:mm',
    beginYear: 2000,
    endYear: 2100,
    lang: {
        title: '请选择日期'
    }
})
// 打开结束日期选择
function openEndDate() {
  rdE.show();
}

// 提交
function subTask() {
  console.log('点击了提交');
}

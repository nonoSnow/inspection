// 负责人
var headList = {};

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  // 监听负责人的选择
  api.addEventListener({
      name: 'headList'
  }, function(ret, err) {
      // api.closeWin({name:'headList'})
      // 获取选中的负责人信息
      headList = JSON.parse(ret.value.checkHeadObj);
      $('#person').val(headList.name);
  });

}

// 进入负责人选择页面
function onOpenHead() {
    api.openWin({
        name: 'headList',
        url: '../Job/headList.html'
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

  var taskName = $('#').val();
  console.log(taskName);
  if (taskName == '') {
    // 提示没有输入任务名称
  }

  console.log(headList.name);
  if (headList.name == undefined) {
    // 提示没有选择负责人
  }

  var planStartTime = $('#planStartTime').val();
  console.log(planStartTime);

  if (planStartTime == '') {
    // 提示输入开始时间
  } else {
    // 比较时间大小，开始时间必须从第二天开始
  }

  var planEndTime = $('#planEndTime').val();
  console.log(planEndTime);
}

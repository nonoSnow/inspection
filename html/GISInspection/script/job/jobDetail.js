
var jobType;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  jobType = api.pageParam.type;
  if (jobType == 0) {
    $('.turn-btn').addClass('aui-hide');
    $('.receive-btn').addClass('aui-hide');
    $('.job-receive').addClass('aui-hide');

    $('.job-status').addClass('bgc-gre');
    $('.job-status-text').html('进行中');
  } else if (jobType == 1) {
    $('.handle-btn').addClass('aui-hide');
    $('.handle-head').addClass('aui-hide');

    $('.job-status').addClass('bgc-war');
    $('.job-status-text').html('待接收');
  } else if (jobType == 2) {
    // 测试代码 工单已完成  或  已关闭  后期修改
    var jobStatus = 1;
    if (jobStatus == 1) {
      $('.job-status').addClass('bgc-5cd');
      $('.job-ok').removeClass('aui-hide');
      $('.job-status-text').html('已完成');
    } else {
      $('.job-status').addClass('bgc-cc6');
      $('.job-status-text').html('已关闭');
    }

    $('.footer').addClass('aui-hide');
    $('.flex-con').removeClass('margin-bot250');
    $('.job-receive').addClass('aui-hide');

  }
}

function onOpenCloseTurn(type) {
  console.log(type);
  api.openWin({
      name: 'jobCloseTurn',
      url: './jobCloseTurn.html',
      pageParam: {
          type: type
      }
  });

}

function onOpenHandle() {
  api.openWin({
      name: 'jobHandle',
      url: './jobHandle.html',
      pageParam: {
          name: 'test'
      }
  });

}

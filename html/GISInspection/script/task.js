
var nowTypeIndex = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
}

function onMenu(index, el) {
  nowTypeIndex = index;
  if (index == '0') {
    $('.item-left').html('暂停');
    $('.item-right').html('完成');

    $('.item-bot-btn').removeClass('aui-hide');
    $('.handle-overdue').removeClass('aui-hide');
    $('.complete').addClass('aui-hide');
  } else if (index == '1') {
    $('.item-left').html('关闭');
    $('.item-right').html('启动');

    $('.item-bot-btn').removeClass('aui-hide');
    $('.handle-overdue').removeClass('aui-hide');
    $('.complete').addClass('aui-hide');
  } else if (index == '2') {
    $('.item-left').html('关闭');
    $('.item-right').html('重启');

    $('.item-bot-btn').removeClass('aui-hide');
    $('.handle-overdue').addClass('aui-hide');
    $('.complete').addClass('aui-hide');
  } else if (index == '3') {
    $('.item-bot-btn').addClass('aui-hide');
    $('.handle-overdue').addClass('aui-hide');

    $('.complete').removeClass('aui-hide');
  }
  onCheckMenu(el, function(){
    // console.log(123);
  });
}

function onOpenTaskDetail() {
  api.openWin({
      name: 'homeTaskInfo',
      url: '../Home/homeTaskInfo.html',
      pageParam: {
          type: nowTypeIndex
      }
  });

}

function onItemLeft() {
  var e = e || window.event;
  e.stopPropagation();
  // console.log('click left');
}

function onItemRight() {
  var e = e || window.event;
  e.stopPropagation();
  // console.log('click right');
}

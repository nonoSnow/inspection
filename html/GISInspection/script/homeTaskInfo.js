
var nowTaskType;

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  nowTaskType = api.pageParam.type;
  if (nowTaskType == '0') {
    $('.task-stop').html('暂停');
    $('.task-complete').html('完成');
  } else if (nowTaskType == '1') {
    $('.task-stop').html('关闭');
    $('.task-complete').html('启动');
  } else if (nowTaskType == '2') {
    $('.task-stop').html('关闭');
    $('.task-complete').html('重启');
  } else if (nowTaskType == '3') {
    $('.footer').addClass('aui-hide');
    $('.flex-con').removeClass('margin-bot250');
  }

  onMenu(0, '');

}

function onMenu(index, el) {
  if (index == 0) {
    $(".task-info").removeClass('aui-hide');
    $(".footer").removeClass('aui-hide');

    $(".task-list").addClass('aui-hide');
    $(".flex-con").addClass('margin-bot250');
  } else if(index == 1 || index == 2) {
    $(".task-info").addClass('aui-hide');
    $(".footer").addClass('aui-hide');

    $(".task-list").removeClass('aui-hide');
    $(".flex-con").removeClass('margin-bot250');

    if (index == 1) {
      $('.item-btn').addClass('aui-hide');
      $('.inspector').addClass('aui-hide');
      $('.completion-time').addClass('aui-hide');
    } else {
      $('.item-btn').removeClass('aui-hide');
      $('.inspector').removeClass('aui-hide');
      $('.completion-time').removeClass('aui-hide');
    }
  }
  if (el == '') {
    return;
  }
  onCheckMenu(el, function(){
    console.log(123);
  });
}

function onOpenEquipment() {
  api.openWin({
      name: 'equipmentMapInfo',
      url: './equipmentMapInfo.html',
      pageParam: {
          name: 'test'
      }
  });

}

function onOpenTaskDetail() {
  api.openWin({
      name: 'taskInfoSubmit',
      url: './taskInfoSubmit.html',
      pageParam: {
          type: 'detail'
      }
  });

}

function onOpenTaskStop() {
  api.openWin({
      name: 'taskStop',
      url: './taskStop.html',
      pageParam: {
          name: 'test'
      }
  });

}

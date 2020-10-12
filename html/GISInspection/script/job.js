
var jobType = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
}

function onMenu(index, el) {
  jobType = index;
  if (index == 0) {
    $('.charge').removeClass('aui-hide');
    $('.start-time').removeClass('aui-hide');
    $('.start-time').addClass('margin-top6');
    $('.start-time').removeClass('margin-top10');

    $('.end-time').addClass('aui-hide');

    $('.line').removeClass('aui-hide');
    $('.item-footer').removeClass('aui-hide');
  } else if (index == 1) {
    $('.start-time').removeClass('aui-hide');
    $('.start-time').removeClass('margin-top6');
    $('.start-time').addClass('margin-top10');

    $('.charge').addClass('aui-hide');
    $('.end-time').addClass('aui-hide');

    $('.line').removeClass('aui-hide');
    $('.item-footer').removeClass('aui-hide');
  } else if (index == 2) {
    $('.charge').removeClass('aui-hide');
    $('.start-time').removeClass('aui-hide');
    $('.end-time').removeClass('aui-hide');
    $('.start-time').addClass('margin-top6');
    $('.start-time').removeClass('margin-top10');

    $('.line').addClass('aui-hide');
    $('.item-footer').addClass('aui-hide');
  }
  onCheckMenu(el, function(){
    console.log(123);
  });
}

// 任务详情
function onOpenJobDetail() {
  api.openWin({
      name: 'jobDetail',
      url: './jobDetail.html',
      pageParam: {
          type: jobType
      }
  });

}

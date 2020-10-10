
var nowType;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  nowType = api.pageParam.type;
  if (nowType == '0') {
    // 转派原因
    $('.required').addClass('aui-hide');
    $('.photo').addClass('aui-hide');
    $('.headUser').addClass('aui-hide');

    $('.aui-title').html('转派原因');
    $('.reason').html('转派原因');
    $('.file-title').html('附件信息');

    $('.textarea').css('readonly', 'true');
  } else if (nowType == '1') {
    // 关闭工单
    $('.headUser').addClass('aui-hide');

    $('.aui-title').html('关闭工单');
  } else if (nowType == '2') {
    // 转派
    $('.aui-title').html('转派工单');
  }
}

function onOpenHead() {
  api.openWin({
      name: 'headList',
      url: './headList.html'
  });
}

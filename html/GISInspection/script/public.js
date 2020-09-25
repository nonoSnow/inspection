
/*
 *  实现沉浸式状态栏效果
 */
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
}

/*
 *  头部-类型点击公共方法
 */
function onCheckMenu(index, callback) {
  var footerList = document.getElementsByClassName('header-type-item');
  var footerline = document.getElementsByClassName('type-line');
  for (var i = 0; i < footerList.length; i++) {
    $api.removeCls(footerList[i], 'color-598');
    $api.removeCls(footerline[i], 'bgc-blue');
  }
  $api.addCls(footerList[index], 'color-598');
  $api.addCls(footerline[index], 'bgc-blue');

  callback();
}

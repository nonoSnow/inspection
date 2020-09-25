
function onMenu(index) {
  if (index == 0) {
    $api.addCls($api.dom('.end-time'), 'aui-hide');
  } else {
    $api.removeCls($api.dom('.end-time'), 'aui-hide');
  }

  if (index == 1) {
    $api.addCls($api.dom('.charge'), 'aui-hide');
  } else {
    $api.removeCls($api.dom('.charge'), 'aui-hide');
  }

  if (index == 1) {
    $api.addCls($api.dom('.charge'), 'aui-hide');
  } else {
    $api.removeCls($api.dom('.charge'), 'aui-hide');
  }
  onCheckMenu(index, function(){
    console.log(123);
  });
}

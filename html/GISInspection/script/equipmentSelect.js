apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);
}

function onMenu(index, el) {
  onCheckMenu(el, function(){
    console.log(123);
  });
}


apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
}

function onMenu(index, el) {
  onCheckMenu(el, function(){
    console.log(123);
  });
}

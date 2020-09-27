
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

}

function onMenu(index, el) {
  onCheckMenu(index, el, function(){
    console.log('method');
  });
}

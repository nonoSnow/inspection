
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

}

function onManagement(pageName) {
  api.openWin({
      name: pageName + 'Management',
      url: './'+ pageName + 'Management/' + pageName +'Management.html'
  });

}

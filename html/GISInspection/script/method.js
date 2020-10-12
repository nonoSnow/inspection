
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

}

function onMenu(index, el) {
  onCheckMenu(el, function(){
    console.log('method');
  });
}

function onOpenMethodDetail() {
  api.openWin({
      name: 'taskInfoSubmit',
      url: '../home/taskInfoSubmit.html',
      pageParam: {
          type: 'detail'
      }
  });

}

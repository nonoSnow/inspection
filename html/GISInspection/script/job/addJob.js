
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        $('#jobType').val($(this).text());
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });

    api.addEventListener({
        name: 'headList'
    }, function(ret, err) {
        alert(JSON.stringify(ret.value));
    });
}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("methodTypePop"));
}

function onOpenHead() {
  api.openWin({
      name: 'headList',
      url: './headList.html',
      pageParam: {
          name: 'test'
      }
  });

}

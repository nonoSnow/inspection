
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        $('#methodType').val($(this).text());
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });
}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("methodTypePop"));
}

function onOpenArea(type) {
  api.openWin({
      name: 'area',
      url: '../area/area.html',
      pageParam: {
          type: type
      }
  });

}

var headList;  // 负责人信息
var jobType; // 工单类型
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        $('#jobType').val($(this).text());
        jobType = $(this).attr("value");
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });

    api.addEventListener({
        name: 'headList'
    }, function(ret, err) {
        alert(JSON.stringify(ret.value));
        headList = ret.value
    });
    // 创建日期
    new Rolldate({
				el: '#date-group1-3',
				format: 'YYYY-MM-DD hh',
				beginYear: 2000,
				endYear: 2100
			})
}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("jobTypePop"));
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

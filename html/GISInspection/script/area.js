var mapListStatus = 0;

var bodyHeight;
var block;
var oTop = 0;

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    var pageType = api.pageParam.type;
    console.log(pageType);
    if (pageType == 1 || pageType == 2) {
      $('.aui-pull-left').removeClass('aui-hide');
      $('.aui-title').html('巡检片区');
    } else {
      $('.aui-pull-left').addClass('aui-hide');
      $('.aui-title').html('片区');
    }

    if (api.systemType == 'android') {
      bodyHeight = $('body').height() - 25;
    } else if (api.systemType == 'ios') {
      bodyHeight = $('body').height() - 20;
    }

    onMoveShowList(
      document.getElementById('map-footer'),
      'map-footer',
      $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
      $('.list-item').height() + 0.75 * 20,
      mapListStatus,
      bodyHeight, function(ret){
        console.log(ret);
        mapListStatus = ret;
        onTransitionStatus(mapListStatus);
      });
}

function onShowItem() {
  onShowList('map-footer',
             $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
             $('.list-item').height() + 0.75 * 20,
             mapListStatus,
             bodyHeight,
             function(ret){
                console.log(ret);
                mapListStatus = ret;
                onTransitionStatus(mapListStatus);
             });
}

function onTransitionStatus(mapListStatus) {
  if (mapListStatus == 0) {
    $(".list-xl").css("transform", "rotate(180deg)");
    $(".list-xl").removeClass("aui-hide");

    $(".transition-status2").addClass("aui-hide");
  } else if (mapListStatus == 1) {
    $(".list-xl").addClass("aui-hide");

    $(".transition-status2").removeClass("aui-hide");
  } else if (mapListStatus == 2) {
    $(".list-xl").css("transform", "rotate(0deg)");
    $(".list-xl").removeClass("aui-hide");

    $(".transition-status2").addClass("aui-hide");
  }
}

function onGetSearchVal() {
  console.log($("#search-input").val());
  var searchVal = $("#search-input").val();
  if (searchVal != '' && searchVal != ' ') {
    $('.search-btn').removeClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'inline-block');
  } else {
    $('.search-btn').addClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'none');
  }
}

function onOpenAreaDetail() {
  api.openWin({
      name: 'areaDetail',
      url: './areaDetail.html',
      pageParam: {
          name: 'test'
      }
  });

}

function onOpenAdd() {
  api.openWin({
      name: 'addArea',
      url: './addArea.html',
      pageParam: {
          name: 'test'
      }
  });

}


var carData = [];
var pageType = '';

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  carData = api.pageParam.carArr;
  pageType = api.pageParam.type;
  console.log(pageType);
  if (pageType == '1') {
    $("#header").text("车辆总数：" + carData.length);
  } else if (pageType == '2') {
    $("#header").text("在线车辆：" + carData.length);
  } else if (pageType == '3') {
    $("#header").text("离线车辆：" + carData.length);
  }

  $(".carNum").text(carData.length);
  $("#nameList").on('click', 'li', function() {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    } else {
      $(this).addClass('active');
    }
  });

  onGetCarData();
}

function onGetCarData() {

  var datas = {
      datas: carData
  };

  var str = template('carNameList', datas);

  $(".car-name-item").remove();
  $("#nameList").append(str);
}

function onOk() {
  console.log($("#nameList li").hasClass('active'));
  if (!$("#nameList li").hasClass('active')) {
    var dialog = new auiDialog({});
    dialog.alert({
        title: "请选择车辆",
        buttons: ['确定']
    },function(ret){

    });
    return false;
  }
  $("#nameList li").each(function() {
    if ($(this).hasClass('active')) {
      console.log(JSON.stringify($(this).attr('item')));
    }
  });
  onCloseFrame();
}

function onCloseFrame() {
  api.closeFrame({});

}

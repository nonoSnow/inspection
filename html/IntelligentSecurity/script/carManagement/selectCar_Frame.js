
var carData = [];

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

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
  carData = [
    {"id": "0001", "type": "0", "carName": "渝A66666", "position": ["106.5025712070178", "29.591623152627714"]},
    {"id": "0002", "type": "1", "carName": "渝A88888", "position": ["106.5325712070178", "29.551623152627714"]},
    {"id": "0003", "type": "0", "carName": "渝A99999", "position": ["106.5325712070178", "29.501623152627714"]},
    {"id": "0001", "type": "0", "carName": "渝A66666", "position": ["106.5025712070178", "29.591623152627714"]},
    {"id": "0002", "type": "1", "carName": "渝A88888", "position": ["106.5325712070178", "29.551623152627714"]},
    {"id": "0003", "type": "0", "carName": "渝A99999", "position": ["106.5325712070178", "29.501623152627714"]},
  ];

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

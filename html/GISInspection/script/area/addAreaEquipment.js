
// 选中的设备 - 管线
var checkPoint = [];
var checkLine = [];

var areaPoint = "";

var defaultPoint = [];
var defaultLine = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  defaultPoint = api.pageParam.checkPoint;
  defaultLine = api.pageParam.checkLine;
  areaPoint = api.pageParam.areaPoint;

  onShowHtml('0');
  onShowHtml('1');
}

function onMenu(index, el){
  onCheckMenu(el, function(){
    document.getElementById('contBox').scrollTop = 0;
    if (index == '0') {
      $('#equipmentList').removeClass('aui-hide');
      $('#equipmentList1').addClass('aui-hide');
    } else if (index == '1') {
      $('#equipmentList1').removeClass('aui-hide');
      $('#equipmentList').addClass('aui-hide');
    }
  });
}

function onShowHtml(type) {
  if (type == '0') {
    var datas = {
      datas: defaultPoint
    };
    var str = template('pointItem', datas);
    $('#equipmentList').empty();
    $('#equipmentList').append(str);
  } else if (type == '1') {
    var datas = {
      datas: defaultLine
    };
    var str = template('lineItem', datas);
    $('#equipmentList1').empty();
    $('#equipmentList1').append(str);
  }
}

function onSave() {
  var isChecked = true;
  $(".point input:checked").each(function(i){
    checkPoint.push(JSON.parse($(this).attr('item')));
  });
  $(".lineitem input:checked").each(function(i){
    checkLine.push(JSON.parse($(this).attr('item')));
  });
  if (checkPoint.length == 0 && checkLine.length == 0) {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return;
  }

  api.openWin({
      name: 'addArea',
      url: './addArea.html',
      pageParam: {
          checkPoint: checkPoint,
          checkLine: checkLine,
          areaPoint: areaPoint
      }
  });

}

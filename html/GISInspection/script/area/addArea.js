
var areaPoint = "";
var checkPoint = [];
var checkLine = [];

var lineLength = 0;
var deviceLists = [];
var pipeloneLists = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  areaPoint = api.pageParam.areaPoint;
  checkPoint = api.pageParam.checkPoint;
  checkLine = api.pageParam.checkLine;

  for (var i = 0; i < checkLine.length; i++) {
    lineLength += parseFloat(checkLine[i].length);

    var flats = checkLine[i].geom.match(/LINESTRING\((.*)\)/)[1].split(',');
    var coordinates = [];
    for(var k = 0; k < flats.length; k++) {
        coordinates.push(flats[k].split(' '));
    }
    var x = (Number(coordinates[0][0]) + Number(coordinates[1][0])) / 2;
    var y = (Number(coordinates[0][1]) + Number(coordinates[1][1])) / 2;
    pipeloneLists.push({
      deviceName: checkLine[i].material,
      deviceCode: checkLine[i].lineNumber,
      devicePoint: x + ',' + y,
      address: checkLine[i].location,
    });
  }

  for (var i = 0; i < checkPoint.length; i++) {
    var coordinates = checkPoint[i].geom.match(/POINT\((.*)\)/)[1];
    deviceLists.push({
      deviceName: checkPoint[i].pointName,
      deviceCode: checkPoint[i].pointNumbe,
      devicePoint: coordinates.split(' ').join(','),
      address: checkPoint[i].location,
    });
  }

}

function onGetAreaName() {
  if ($("#areaName").val() != '') {
    $(".footer-btn").removeClass('btn-disabled');
  } else {
    $(".footer-btn").addClass('btn-disabled');
  }
}

function onSave() {
  if ($(".footer-btn").hasClass('btn-disabled')) {
    return false;
  }

  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var data = {
    name: $("#areaName").val(),
    pipelineLength: lineLength,
    pointCount: checkPoint.length,
    areaPoint: areaPoint,
    deviceLists: deviceLists,
    pipeloneLists: pipeloneLists
  };
  var optionsAdd = {
    url: baseUrl + "api/services/Inspection/AreaService/InsertArea",
    data: data,
    success: function(ret) {
      api.hideProgress();
      console.log(JSON.stringify(ret));

      api.sendEvent({
          name: 'addAreaOk',
          extra: { }
      });

      winCloseName('areaLayer');
      winCloseName('areaDivide');
      winCloseName('addAreaEquipment');
      api.closeWin({});
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsAdd);
}

// 关闭指定页面
function winCloseName(name){
	if (api.systemType == 'ios')
	{
		setTimeout(function(){
			api.execScript(
			{
				name: "root",
				script: "api.closeWin({name:'"+name+"'});"
			});
		},500)
	}
	else
	{
		api.closeWin({name:name});
	}
}

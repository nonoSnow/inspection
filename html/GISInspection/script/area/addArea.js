
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

  // console.log(JSON.stringify(areaPoint));
  // console.log(JSON.stringify(checkPoint));
  // console.log(JSON.stringify(checkLine));

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
  if (deviceLists.length == 0 && pipeloneLists.length != 0 && lineLength < 1) {
    api.toast({
        msg: '管道长度必须大于等于1km，请重置区域',
        duration: 2000,
        location: 'middle'
    });

    setTimeout(function() {
      winCloseName('addAreaEquipment');
      api.closeWin();
    }, 2000);

    return false
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
    pipelineLists: pipeloneLists
  };
  var optionsAdd = {
    url: baseUrl + "api/services/Inspection/AreaService/InsertArea",
    data: data,
    timeout: 300,
    success: function(ret) {
      api.hideProgress();
      // console.log(JSON.stringify(ret));

      api.sendEvent({
          name: 'addAreaOk',
          extra: { }
      });

      winCloseName('areaLayer');
      winCloseName('areaDivide');
      winCloseName('addAreaEquipment');

      // api.sendEvent({
      //     name: 'needCloseWin',
      //     extra: {
      //         key1: 'value1'
      //     }
      // });
      // setTimeout(function() {
        api.closeWin({});
      // }, 500)

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
				name: "inspectionMain",
				script: "api.closeWin({name:'"+name+"'});"
			});
		},500)
	}
	else
	{
		api.closeWin({name: name});
	}
}

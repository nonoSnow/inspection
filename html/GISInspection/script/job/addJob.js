var headList;  // 负责人信息
var jobType; // 工单类型

var indexMap = {};
var areaInfo = {};  // 巡检区域相关信息
var equipment = {}; // 设备相关信息

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

    api.addEventListener({
        name: 'addArea'
    }, function(ret, err){
        $("#areaMapDiv").removeClass("padding75");
        $("#areaDefault").addClass("aui-hide");
        $("#areaMap").removeClass("aui-hide");

        if ($.isEmptyObject(indexMap)) {
          // 初始化地图
          indexMap = new Map({
              mapid: 'areaMap'
          });
          indexMap.initArea('addArea');
          indexMap.initDeviceLayer('addArea');
        }
        indexMap.mapClearSource({name: 'addArea'});
        console.log(JSON.stringify(ret));
        areaInfo = ret.value.areaInfo;
        indexMap.drawAreaSelect(areaInfo.areaPoint, {name: 'addArea'});

        equipment = ret.value.equipment;
        var lineList = pointList = [];
        if (equipment[0].type == '1') {
          pointList = equipment;
        } else {
          lineList = equipment;
        }
        indexMap.mapConduitEquipment({
            areaPoint: areaInfo.areaPoint,
            lineList: lineList,
            pointList: pointList
        }, {name: 'addArea'});
        console.log(JSON.stringify(equipment));
        console.log(typeof equipment);
    });

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

// 添加巡检片区
function onOpenArea() {
  api.openWin({
      name: 'area',
      url: '../area/area.html',
      pageParam: {
          type: 1,
          areaInfo: areaInfo,
          equipment: equipment
      }
  });

}

var mapListStatus = 0;

var bodyHeight;
var block;
var oTop = 0;

var indexMap = {};
var areaList = [];

var userId = '';

var pageType = '';

var isSearch = false;

// 工单  巡检片区选择区域及设备信息
var checkAreaInfo = checkEquipment = {};

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    userId = $api.getStorage('userLoginInformation').currentUserInfo.userInfo.userId;

    if (api.systemType == 'android') {
      bodyHeight = $('body').height() - 25;
    } else if (api.systemType == 'ios') {
      bodyHeight = $('body').height() - 20;
    }

    // 初始化地图
    indexMap = new Map({
        mapid: 'mapArea'
    });
    indexMap.initArea('areaList');
    indexMap.initDeviceLayer('areaList');

    pageType = api.pageParam.type;

    if (pageType == 1 || pageType == 2) {
      $('.aui-pull-left').removeClass('aui-hide');
      $('.aui-title').html('巡检片区');

      checkAreaInfo = api.pageParam.areaInfo;
      checkEquipment = api.pageParam.equipment;

    } else {
      $('.aui-pull-left').addClass('aui-hide');
      $('.aui-title').html('片区');
    }

    // 新增片区成功，刷新列表
    api.addEventListener({
        name: 'addAreaOk'
    }, function(ret, err){
        onGetListData();
    });


    onGetListData();

}

function onShowItem() {
  onShowList('map-footer',
             $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
             $('.list-item').height() + 0.75 * 20,
             mapListStatus,
             bodyHeight,
             function(ret){
                mapListStatus = ret;
                onTransitionStatus(mapListStatus);
             });
}

function onTransitionStatus(mapListStatus) {
  console.log(mapListStatus);
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

  if (mapListStatus == 2 && isSearch) {
    console.log('是搜索');
    $('#areaList').addClass("aui-hide");
    $('#areaSearcgList').removeClass("aui-hide");
    $(".area-search-text").text("搜索");
  } else {
    isSearch = false;
    $('#areaList').removeClass("aui-hide");
    $('#areaSearcgList').addClass("aui-hide");
    $(".area-search-text").text("片区列表");
  }
}

function onGetSearchVal() {
  var searchVal = $("#search-input").val();
  if (searchVal != '' && searchVal != ' ') {
    $('.search-btn').removeClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'inline-block');
  } else {
    $('.search-btn').addClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'none');
  }
}

function onOpenAreaDetail(item) {
  onCheckedArea(item);
  if (pageType == 1) {
    api.openWin({
        name: 'areaDetail',
        url: './areaDetail.html',
        pageParam: {
            areaInfo: item,
            checkAreaInfo: checkAreaInfo,
            checkEquipment: checkEquipment
        }
    });
  } else if (pageType == 2) {
    api.openWin({
        name: 'equipmentSelect',
        url: './equipmentSelect.html',
        pageParam: {
          areaInfo:  item,
          checkEquipment:  checkEquipment[0]
        }
    });
  }
}

function onOpenAdd() {
  api.openWin({
      name: 'areaLayer',
      url: './areaLayer.html',
      pageParam: {
          name: 'test'
      }
  });
}

function onEmptySearch() {
  $("#search-input").val('');
  onGetSearchVal();
  onGetListData();
}
// 搜索框点击搜索
function searchByInput() {
  var data = {
    name: $("#search-input").val(),
    pageIndex: 1,
    maxResultCount: 1000
  };
  onSearchVal(data);
}
// 根据片区名称模糊查询片区信息
function onSearchVal(data) {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var optionsEmpty = {
    url: baseUrl + "api/services/Inspection/AreaService/AppGetAreaDetailsByName",
    data: data,
    success: function(ret) {
      api.hideProgress();
      $('#areaSearcgList').empty();
      var searchArea = ret.result.items;
      var areaPointArr = [];
      for (var i = 0; i < searchArea.length; i++) {
        areaPointArr.push({areaPoint: searchArea[i].areaPoint});
      }

      onMapShow(areaPointArr, searchArea);

      onShowHtml(searchArea);
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsEmpty);

  isSearch = false;
  $('#areaList').removeClass("aui-hide");
  $('#areaSearcgList').addClass("aui-hide");
  $(".area-search-text").text("片区列表");
}

// 点击历史搜索记录搜索片区
function searchArea(that) {
  // console.log(data);
  var searchWords = $(that).attr('parse');
  var data = {
    name: searchWords,
    pageIndex: 1,
    maxResultCount: 1000
  };
  onSearchVal(data);
}

function onGetListData() {
  areaList = [];
  var data = {
    name: '',
    id: userId,
    pageIndex: 1,
    maxResultCount: 1000
  };
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  // 获取自己创建的片区列表
  var optionsMy = {
    url: baseUrl + "api/services/Inspection/AreaService/GetAreaMyListsAPP",
    data: data,
    success: function(ret){
      // console.log(JSON.stringify(ret));
      var myAreaArr = ret.result.items;
      // 获取别人创建的片区列表
      var optionsOther = {
        url: baseUrl + "api/services/Inspection/AreaService/GetAreaOtherListsAPP",
        data: data,
        success: function(ret) {
          api.hideProgress();
          // console.log(JSON.stringify(ret));
          var otherAreaArr = ret.result.items;
          var areaPointArr = [];
          areaList = myAreaArr.concat(otherAreaArr);
          for (var i = 0; i < areaList.length; i++) {
            areaPointArr.push({areaPoint: areaList[i].areaPoint});
          }
          onMapShow(areaPointArr, areaList);

          if (checkAreaInfo != undefined && JSON.stringify(checkAreaInfo) != "{}") {
            onCheckedArea(checkAreaInfo);

            var lineList = pointList = [];
            if (checkEquipment[0].type == '1') {
              pointList = checkEquipment;
            } else {
              lineList = checkEquipment;
            }
            indexMap.mapConduitEquipment({
                areaPoint: checkAreaInfo.areaPoint,
                lineList: lineList,
                pointList: pointList
            }, {name: 'areaList'});
          }

          onShowHtml(areaList);

          onMoveShowList(
            document.getElementById('map-footer'),
            'map-footer',
            $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
            $(".list-item").height() + 0.75 * 20,
            mapListStatus,
            bodyHeight, function(ret){
              mapListStatus = ret;
              onTransitionStatus(mapListStatus);
            });
        },
        error: function(err) {
          api.hideProgress();
          console.log(JSON.stringify(err));
        }
      };
      ajaxMethod(optionsOther);

    },
    error: function(err){
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsMy);

}

function onInuptBlur() {
  // $('#areaList').removeClass("aui-hide");
  // $('#areaSearcgList').addClass("aui-hide");
  // $(".area-search-text").text("片区列表");
}

function onInuptFocus() {
  console.log('点击了搜索的输入框');
  isSearch = true;
  console.log(isSearch);
  $('#areaList').addClass("aui-hide");
  $('#areaSearcgList').removeClass("aui-hide");

  $(".area-search-text").text("搜索");
  console.log('11111111111');
  $(window).resize(function() {
    console.log($(this).height());
    var bHeight;
    if (api.systemType == 'android') {
      bHeight = $(this).height() - 25;
    } else if (api.systemType == 'ios') {
      bHeight = $(this).height() - 20;
    }
    $(".map-footer").css("height", bHeight + 'px');
    mapListStatus = 2;
    onTransitionStatus(mapListStatus);
    // onShowList('map-footer',
    //            $('.status1').height() + 0.5 * 20 + $('.status2').height() + 0.75 * 20,
    //            $('.list-item').height() + 0.75 * 20,
    //            1,
    //            bHeight,
    //            function(ret){
    //               mapListStatus = ret;
    //               onTransitionStatus(mapListStatus);
    //            });
     // 获取搜索历史记录
    //  api.showProgress({
    //      title: '加载中',
    //      text: '',
    //      modal: false
    //  });
    //  var data = {
    //    name: '',
    //    id: userId,
    //    pageIndex: 1,
    //    maxResultCount: 10
    //  };
    //  console.log(data);
    //  var optionsHistory = {
    //    url: baseUrl + "api/services/Inspection/AreaService/GetAreaHistory",
    //    data: data,
    //    success: function(ret) {
    //      console.log(JSON.stringify(ret));
    //      api.hideProgress();
    //      var searchArr = ret.result;
    //      if (searchArr.length == 0)
    //         return false;
    //      var datas = {
    //        datas: searchArr
    //      };
    //      var str = template('areaSearch', datas);
    //      $('#areaSearcgList').empty();
    //      $('#areaSearcgList').append(str);
    //      var emptyLi = "<li class='emptyHistory' tapmode onclick='onEmptyHistory()'>清空历史记录</li>";
    //      $('#areaSearcgList').append(emptyLi);
    //    },
    //    error: function(err) {
    //      api.hideProgress();
    //      console.log(JSON.stringify(err));
    //    }
    //  };
    //  ajaxMethod(optionsHistory);
     console.log(2222222222222222222);
  });
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var data = {
    name: '',
    id: userId,
    pageIndex: 1,
    maxResultCount: 10
  };
  console.log(data);
  var optionsHistory = {
    url: baseUrl + "api/services/Inspection/AreaService/GetAreaHistory",
    data: data,
    success: function(ret) {
      console.log(JSON.stringify(ret));
      api.hideProgress();
      var searchArr = ret.result;
      if (searchArr.length == 0)
         return false;
      var datas = {
        datas: searchArr
      };
      var str = template('areaSearch', datas);
      $('#areaSearcgList').empty();
      $('#areaSearcgList').append(str);
      var emptyLi = "<li class='emptyHistory' tapmode onclick='onEmptyHistory()'>清空历史记录</li>";
      $('#areaSearcgList').append(emptyLi);
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsHistory);


}

function onCheckHistory(item) {
  $("#search-input").val(item);
}

// 清空搜索历史记录
function onEmptyHistory() {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var data = {
    id: userId
  };
  var optionsEmpty = {
    url: baseUrl + "api/services/Inspection/AreaService/DeleteAreaHistory",
    data: data,
    success: function(ret) {
      api.hideProgress();
      $('#areaSearcgList').empty();
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsEmpty);
}

function onShowHtml(areaList) {
  var datas = {
    datas: areaList
  };
  if (pageType == 1 || pageType == 2) {
    var str = template('addArea', datas);
  } else {
    var str = template('areaItem', datas);
  }
  $('#areaList').empty();
  $('#areaList').append(str);

}

function onCheckedArea(item) {
  var areaPoint = item.areaPoint.split(';');
  var point = areaPoint[0].split(',');
  indexMap.mapCheckedArea([point[0], point[1]], {name: 'areaList'});
}

function onMapShow(areaPointArr, areaList) {
  indexMap.mapClearSource({name: 'areaList'});
  // 地图渲染区域  添加区域点击事件
  // console.log(JSON.stringify(areaPointArr));
  indexMap.drawAreaSelect(areaPointArr, {name: 'areaList'});
  indexMap.mapClickArea(function(ret) {
    if (ret == undefined) {
      return false;
    }
    var areaLineArr = ret[0];
    var areaLineStr = '';

    for (var i = 0; i < areaLineArr.length; i++) {
      areaLineStr += areaLineArr[i][0] + "," + areaLineArr[i][1] + ";";
    }
    areaLineStr += areaLineArr[0][0] + "," + areaLineArr[0][1] + ";";

    for (var i = 0; i < areaList.length; i++) {
      if (areaLineStr == areaList[i].areaPoint) {
        var ecked = areaList[i];
        areaList.splice(i, 1);
        areaList.unshift(ecked);

        onShowHtml(areaList);
        break;
      }
    }
  });
}

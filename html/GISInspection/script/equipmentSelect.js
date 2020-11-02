
// 片区详情
var areaInfo = {};
// 选中的数据
var checkArr = [];
// 渲染数组
var dataArr = [];
// 默认数据
var checkEquipment = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  areaInfo = api.pageParam.areaInfo;
  checkEquipment = api.pageParam.checkEquipment;
  var type = api.pageParam.type;
  if (type == 1) {
    $('.aui-title').text('设备');
    dataArr = areaInfo.deviceLists;
  } else if (type == 2) {
    $('.aui-title').text('管道');
    dataArr = areaInfo.pipelineLists;
  }

  if (checkEquipment.length > 0) {
    for (var i = 0; i < dataArr.length; i++) {
      if (checkEquipment[0].id == dataArr[i].id) {
        dataArr[i].isCheck = true;
        break;
      }
    }
  }
  onShowHtml(dataArr);

}

function onSearch() {
  var searchVal = $("#searchValue").val();
  var searchArr = [];
  var isFlg = false;
  for (var i = 0; i < dataArr.length; i++) {
    if (dataArr[i].deviceName.indexOf(searchVal) >= 0) {
      isFlg = true;
      searchArr.push(dataArr[i]);
    }
  }
  onShowHtml(searchArr);
}

function onShowHtml(data) {
  var datas = {
    datas: data
  };
  var str = template('list', datas);
  $('#equipmentList').empty();
  $('#equipmentList').append(str);
}

function onSelectOk() {
  $(".equipmentItem").each(function() {
    if ($(this)[0].checked) {
      checkArr.push($(this).attr('item'));
    }
  });
  if (checkArr.length == 0) {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return;
  };
  api.sendEvent({
      name: 'checkEquipment',
      extra: {
          checkArr: checkArr,
          type: api.pageParam.type
      }
  });
  api.closeWin({});
}

function onGetSearchVal() {
  var searchVal = $("#searchValue").val();
  if (searchVal != '' && searchVal != ' ') {
    $('.search-btn').removeClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'inline-block');
  } else {
    $('.search-btn').addClass('aui-hide');
    $('.aui-searchbar-clear-btn').css('display', 'none');
  }
}

function onEmptySearch() {
  $("#searchValue").val('');
  onGetSearchVal();

  onShowHtml(dataArr);
}

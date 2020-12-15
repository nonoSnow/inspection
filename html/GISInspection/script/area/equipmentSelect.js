
// 片区Id
var areaId = '';
var areaInfo = {};

// 设备点集合 - 管道设备集合
var deviceList = pipelineList = [];

// 默认数据
var checkEquipment = {};

var searchWords;

var selectType = 1;  // 当前选择的类型（1：设备，2：管道）
var searchPageIndex = 1; // 搜索的当前分页页数
var searchHasNextPage = false; // 搜索的结果是否还有下一页
var isSearch = false; //是否点击了搜索

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  areaInfo = api.pageParam.areaInfo;
  areaId = areaInfo.id;
  checkEquipment = api.pageParam.checkEquipment;

  onGetData(areaId);

  // 监听搜索框是否有输入
  var searchBox = document.getElementById('search-input');
  searchBox.addEventListener('input', function() {
    searchWords = this.value;
    if (searchWords.length != 0) {
      $('.search-btn').removeClass('aui-hide');
    } else {
      $('.search-btn').addClass('aui-hide');
    }
  })

  api.addEventListener({
    name:'scrolltobottom',
    extra:{
        threshold: 0            //设置距离底部多少距离时触发，默认值为0，数字类型
    }
  }, function(ret, err){
      if (isSearch) {
        // 是通过搜索来的
        // console.log('滚动到底部了');
        if (searchHasNextPage) {
          searchPageIndex++;
          searchEquip();
        } else {
          api.toast({
              msg: '没有更多数据了',
              duration: 2000,
              location: 'middle'
          });
        }
      }
  });
}

function onMenu(index, el){
  selectType = index + 1;
  isSearch = false;
  searchWords = '';
  $('#search-input').val('');
  searchPageIndex = 1;
  searchHasNextPage = false;
  $('.search-btn').addClass('aui-hide');

  onCheckMenu(el, function(){
    $(".equipmentItem").each(function() {
      if ($(this)[0].checked) {
        checkEquipment = JSON.parse($(this).attr('item'));
      }
    });
    onShowCheckArr(index);
  });
}

function onGetData(areaId) {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var data = {
    id: areaId
  };
  var optionsInfo = {
    url: baseUrl + "api/services/Inspection/AreaService/GetGetAreaDetails",
    data: data,
    success: function(ret) {
      api.hideProgress();
      deviceList = ret.result.deviceLists;
      pipelineList = ret.result.pipelineLists;

      if (JSON.stringify(checkEquipment) == '{}') {
        onShowHtml('0');
      } else {
        onShowCheckArr('');
      }
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsInfo);
}

function onShowCheckArr(index) {
  if (checkEquipment.type == 1) {
    for (var i = 0; i < deviceList.length; i++) {
      if (checkEquipment.id == deviceList[i].id) {
        deviceList[i].isCheck = true;
      } else {
        deviceList[i].isCheck = false;
      }
    }
    for (var i = 0; i < pipelineList.length; i++) {
      pipelineList[i].isCheck = false;
    }
    if (index === '') {
      index = '0';
    }
  } else if (checkEquipment.type == 2) {
    for (var i = 0; i < pipelineList.length; i++) {
      if (checkEquipment.id == pipelineList[i].id) {
        pipelineList[i].isCheck = true;
      } else {
        pipelineList[i].isCheck = false;
      }
    }
    for (var i = 0; i < deviceList.length; i++) {
      deviceList[i].isCheck = false;
    }
    if (index === '') {
      index = '1';
    }
  }
  onShowHtml(index);
}

function onShowHtml(type) {
  var datas = {};
  if (type == '0') {
    datas = {
      datas: deviceList
    };
  } else if (type == '1') {
    datas = {
      datas: pipelineList
    };
  }
  var str = template('equipmentItem', datas);
  $('#equipmentList').empty();
  $('#equipmentList').append(str);
}

function onCheck(el) {
  checkEquipment = JSON.parse($(el).attr('item'));
}

function onSave() {

  if (JSON.stringify(checkEquipment) == '{}') {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return;
  };
  api.sendEvent({
      name: 'addMethodEquipment',
      extra: {
          areaInfo: areaInfo,
          equipment: checkEquipment
      }
  });
  api.closeToWin({
      name: 'addMethodReport'
  });

}

// 点击了搜索
function clickSearch() {
  isSearch = true;
  $('#equipmentList').empty();
  searchEquip();
}

// 搜索设备
function searchEquip() {
  var param = {
    areaId: areaId,
    type: selectType,// 设备类型：1：设备点；2：管道设备
    deviceCode:	searchWords,
    pageIndex: searchPageIndex,
    maxResultCount: 30,
  }
  api.showProgress({
    title: '加载中',
    text: '',
    modal: false
  });

  var optionsInfo = {
    url: baseUrl + "api/services/Inspection/DeviceService/AppGetDeviceDetailsByAreaIdAndName",
    data: param,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      searchHasNextPage = ret.result.pageIndex < ret.result.totalPages ? true : false;
      api.hideProgress();
      if (selectType == 1) {
        //设备
        deviceList = ret.result.items;
      } else {
        // 管道
        pipelineList = ret.result.items;
      }
      // deviceList = ret.result.deviceLists;
      // pipelineList = ret.result.pipelineLists;

      if (JSON.stringify(checkEquipment) == '{}') {
        type = (selectType - 1) + '';
        onShowHtml(type);
      } else {
        onShowCheckArr('');
      }
    },
    error: function(err) {
      api.hideProgress();
      console.log(JSON.stringify(err));
    }
  };
  ajaxMethod(optionsInfo);
}

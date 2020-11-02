var checkedArea;
var areaHasNext = false;
var areaData = [];

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  getAreaList();
}

function getAreaList() {
  $('#areaList').html('');
  var param = {
    name: ''
  }
  api.showProgress({
    title: '加载中...',
    text: '请稍后'
  });

  getAreaListData('api/services/Inspection/AreaService/AppGetAreaDetailsByName' ,param, showRet, showErr);

  function showRet(ret) {
    // 请求成功，渲染数据
    console.log(JSON.stringify(ret));


  }

  function showErr(err) {
    console.log(JSON.stringify(err));
    api.hideProgress();

    if(err.body.error != undefined){
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });

    }else{
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }

  var data = {
    list: [
      {
        id: 1,
        name: '测试区域1',
        pipelineLength: 556.4,
        pointCount: 41,
        areaPoint: ''
      },
      {
        id: 2,
        name: '测试区域2',
        pipelineLength: 500.4,
        pointCount: 31,
        areaPoint: ''
      },
      {
        id: 3,
        name: '测试区域3',
        pipelineLength: 556.4,
        pointCount: 51,
        areaPoint: ''
      }
    ]
  }
  console.log(JSON.stringify(data));
  var str = template('areaItems', data);
  $('#areaList').append(str);
}


// 点击确定
function onCheck() {
  // 广播事件
  api.sendEvent({
      name: 'checkedAreaData',
      extra: {
          checkedArea
      }
  });
  api.closeWin();
}

// 选择片区
function checkArea(that) {
  $('#sure').removeClass('aui-hide');
  console.log(typeof($(that).attr('parse')))
  checkedArea = JSON.parse($(that).attr('parse'));
  console.log(JSON.stringify(checkedArea));
}

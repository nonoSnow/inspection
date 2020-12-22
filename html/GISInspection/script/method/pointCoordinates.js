var type = 0;
var checkedArea;
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  initOnDevice();
  onMenu(type)
}

// 获取设备、管道列表
function getAreaList(data,status){
  api.showProgress({
    title: '加载中...',
    text: '请稍后'
  });
  getAreaListData("api/services/Inspection/AreaService/AppGetAreaDetailsByName",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    // console.log("--------------------------"+status);
    $('#areaList').html('');
    var data = {
        list: [
          {
            id: 1,
            name: '测试区域1',
            Code:'JS808029',
            Address:'南京溧水1',

        },
        {
          id: 2,
          name: '测试区域2',
          Code:'JS808029',
          Address:'南京溧水2',

        }
        ]
    };
    var str = template(status, data);
    $('#areaList').append(str);

    // if(ret.success){
    //   $('#areaList').html('');
    //   var data = ret.result.items;
    //   console.log(JSON.stringify(data));
    //   if(data.length){
    //     var list = {list:data};
    //     var str = template(status, list);
    //     $('#areaList').append(str);
    //   }else{
    //     var str="<div style='text-align:center;margin:20px;'>暂无数据</div>"
    //     $('#areaList').append(str);
    //   }
    // }
  }
  function showErr(err) {
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
}
// 初始化设备列表
function initOnDevice(){
  var data = {
    name:''
  }
  getAreaList(data,'onDevice');
}
// 初始化管道列表
function initOnPipeline(){
  var data = {
    name:''
  }
  getAreaList(data,'onPipeline');
}

function onMenu(index, el) {
  type = index;
  if (index == 0) {
    // 设备列表事件
    initOnDevice()
  } else if (index == 1) {
    // 管道列表事件
    initOnPipeline()
  }
  onCheckMenu(el, function(){
    // console.log(el)
  });
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
  // console.log(typeof($(that).attr('parse')))
  checkedArea = JSON.parse($(that).attr('parse'));
  // console.log(JSON.stringify(checkedArea));
}

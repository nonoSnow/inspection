var type = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  initOnPending();
}

// 获取事件列表
function getListData(data,status){
  getEventList("api/services/Inspection/EventService/GetEventList",data,showRet,showErr);
  function showRet(ret){
    // console.log(JSON.stringify(ret));
    $('#dataList').html('');
    var data = {
        list: [
          {
          Id:"1",
          type:"巡检异常1",
          errorType:"外观损坏",
          creationTime:"2020-09-22 18:00",
        },
        {
          Id:"2",
          type:"巡检异常2",
          errorType:"外观损坏",
          creationTime:"2020-09-22 18:00",

        }
        ]
    };
    var str = template(status, data);
    $('#dataList').append(str);
  }

  function showErr(err){
    // console.log(JSON.stringify(err));
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("加载失败")
    }
  }
}
// 初始化待处理的事件列表
function initOnPending(){
  var data = {
    status:1,
    pageIndex:1,
    MaxResultCount:10
  }
  getListData(data,'onPending');
}
// 转工单的事件
function initWorkOrder(){
  var data = {
    status:2,
    pageIndex:1,
    MaxResultCount:10
  }
  getListData(data,'workOrder');

}

// 已关闭的事件
function initClosed(){
  var data = {
    status:3,
    pageIndex:1,
    MaxResultCount:10
  }
  getListData(data,'closed');
}

function onMenu(index, el) {
  type = index;
  if (index == 0) {
    // 待处理事件
    initOnPending()
  } else if (index == 1) {
    // 转工单事件
    initWorkOrder()
  } else if (index == 2) {
    // 已关闭事件
    initClosed()
  }
  onCheckMenu(el, function(){

  });
}
// 获取事件详情
function onOpenMethodDetail(el) {
  api.openWin({
      name: 'methodDetail',
      url: './methodDetail.html',
      pageParam: {
        Id: $(el).attr('param')
      }
  });
}

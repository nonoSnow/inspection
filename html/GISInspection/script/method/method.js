var methodType = 0;
apiready = function() {
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    initOnPending();
    onMenu(methodType)

    api.addEventListener({
        name: 'eventMethod'
    }, function(ret, err){
        if( ret ){
            // alert(JSON.stringify(ret))
            onMenu(ret.value.index)
        }else{
        }
    });

}

// 获取待接收、转工单、已关闭事件列表
function getListData(data,status) {
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        modal: false
    });
    getEventList("api/services/Inspection/EventService/GetEventList",data,showRet,showErr);
    function showRet(ret) {
      api.hideProgress();
      console.log("--------------------------"+status);
      if (ret.success) {
        $('#dataList').html('');
        var data = ret.result.items;
        if (data.length) {
          var list = {list:data};
          var str = template(status, list);
          $('#dataList').append(str);
        } else {
          var str = "<div class='text-cent'><img class='margin-top200' src='../../image/nothing.png'><div class='text-cent color-666 line-height25'>暂无事件</div></div>";
          // var str="<div style='text-align:center;margin:20px;'>暂无数据</div>"
          $('#dataList').append(str);
        }
      }
    }

  function showErr(err){
    console.log(JSON.stringify(err));
    api.hideProgress();
    if (err.body.message == undefined) {
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    } else {
      api.toast({
          msg: err.body.message,
          duration: 2000,
          location: 'middle'
      });
    }
    // if(err.body.error.message){
    //   alert(err.body.error.message)
    // }else {
    //   alert("加载失败")
    // }
  }
}
// 初始化待处理的事件列表
function initOnPending(){
  var data = {
    status:1,
    pageIndex:1,
    maxResultCount:10
  }
  getListData(data,'onPending');
}
// 转工单的事件
function initWorkOrder(){
  var data = {
    status:2,
    pageIndex:1,
    maxResultCount:10
  }
  getListData(data,'workOrder');

}

// 已关闭的事件
function initClosed(){
  var data = {
    status:3,
    pageIndex:1,
    maxResultCount:10
  }
  getListData(data,'closed');
}

function onMenu(index, el) {
  methodType = index;
  if (index == 0) {
    // 待处理事件
    initOnPending()
  } else if (index == 1) {
    // 转工单事件
    initWorkOrder();
  } else if (index == 2) {
    // 已关闭事件
    initClosed()
  }
  var elem = $(".header-type .flex1")
  onCheckMenu(elem[index], function(){
    // console.log(el)
  });
}
// 跳转到事件详情页面
function onOpenMethodDetail(el) {
  api.openWin({
      name: 'methodDetail',
      url: './methodDetail.html',
      pageParam: {
        type: methodType,
        Id: $(el).attr('param')
      }
  });
}
// 跳转到上报事件页面
function onOpenReportEvent() {
  api.openWin({
    name: 'addMethodReport',
    url: './addMethodReport.html',
    pageParam: {
      name: 'test'
    }
  });
}

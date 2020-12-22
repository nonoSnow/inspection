var methodType = 0; // 0：待处理，1：转工单，2：已关闭

// 待处理
var daiPageIndex = 1;
var daiHasNextPage = false;

// 转工单
var transPageIndex = 1;
var transHasNextPage = false;

// 已关闭
var closePageIndex = 1;
var closeHasNextPage = false;

apiready = function() {
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    // initOnPending();
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

    // api.addEventListener({
    //     name: 'scrolltobottom'
    // }, function(ret, err){
    //     if( ret ){
    //          console.log( JSON.stringify( ret ) );
    //     }else{
    //          console.log( JSON.stringify( err ) );
    //     }
    // });
    $('#list-box').scroll(function() {
      var h = $(this).height(); // 可视化高度(681)
      var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
      var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

      // console.log(h + Math.ceil(st) >= sh);

      if (h + Math.ceil(st) >= sh) {
        // console.log(methodType);
        switch (methodType) {
          case 0:
            if (daiHasNextPage) {
              // 如果有下一页，则页码++
              daiPageIndex++;
              // initOngoing();
              initOnPending();
            } else {
              // 提示没有更多数据了
              api.toast({
                  msg: '没有更多数据了~',
                  duration: 2000,
                  location: 'middle'
              });
            }
            break;
          case 1:
            // console.log('转工单');
            if (transHasNextPage) {
              // 如果有下一页，则页码++
              transPageIndex++;
              initWorkOrder();
            } else {
              // 提示没有更多数据了
              api.toast({
                  msg: '没有更多数据了~',
                  duration: 2000,
                  location: 'middle'
              });
            }
            break;
          case 2:
            // console.log('这是已暂停的任务');
            if (closeHasNextPage) {
              // 如果有下一页，则页码++
              closePageIndex++;
              initClosed();
            } else {
              // 提示没有更多数据了
              api.toast({
                  msg: '没有更多数据了~',
                  duration: 2000,
                  location: 'middle'
              });
            }
            break;
        }
      }
    })

}

// 获取待接收、转工单、已关闭事件列表
function getListData(data, status) {
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        modal: false
    });
    getEventList("api/services/Inspection/EventService/GetEventList",data,showRet,showErr);
    function showRet(ret) {
      api.hideProgress();
      // console.log("--------------------------"+status);
      if (ret.success) {
        var data = ret.result.items;
        if (data.length != 0) {
          data.forEach(function (item) {
            if (item.creationTime != null) {
              // item.creationTime = parseTime(item.creationTime, '{y}-{m}-{d} {h}:{i}');
              item.creationTime = moment(item.creationTime).format('YYYY-MM-DD HH:mm');
            }
          })
          var list = {list:data};
          var str = template(status, list);
          $('#dataList').append(str);

          switch (methodType) {
            case 0:
              daiHasNextPage = ret.result.pageIndex < ret.result.totalPages ? true : false;
              break;
            case 1:
              transHasNextPage = ret.result.pageIndex < ret.result.totalPages ? true : false;
              break;
            case 2:
              closeHasNextPage = ret.result.pageIndex < ret.result.totalPages ? true : false;
              break;
          }
        } else {
          var str = "<div class='text-cent'><img class='margin-top200' src='../../image/nothing.png'><div class='text-cent color-666 line-height25'>暂无事件</div></div>";
          // var str="<div style='text-align:center;margin:20px;'>暂无数据</div>"
          $('#dataList').append(str);
        }
      }
    }

  function showErr(err){
    // console.log(JSON.stringify(err));
    api.hideProgress();
    if (err == undefined) {
      api.toast({
          msg: '数据加载失败',
          duration: 2000,
          location: 'middle'
      });
    } else if (err.body.message == undefined) {
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
    status: 1,
    pageIndex: daiPageIndex,
    maxResultCount: 10
  }
  getListData(data,'onPending');
}
// 转工单的事件
function initWorkOrder(){
  var data = {
    status: 2,
    pageIndex: transPageIndex,
    maxResultCount: 10
  }
  getListData(data,'workOrder');

}

// 已关闭的事件
function initClosed(){
  var data = {
    status: 3,
    pageIndex: closePageIndex,
    maxResultCount: 10
  }
  getListData(data,'closed');
}

function onMenu(index, el) {
  $('#dataList').html('');
  methodType = index;
  if (index == 0) {
    // 待处理事件
    daiPageIndex = 1;
    initOnPending()
  } else if (index == 1) {
    // 转工单事件
    transPageIndex = 1;
    initWorkOrder();
  } else if (index == 2) {
    // 已关闭事件
    closePageIndex = 1;
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

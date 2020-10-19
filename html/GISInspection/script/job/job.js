
var jobType = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  initOngoing();
}

// 获取待接收、进行中、已完成的工单 接口调用
function showData(data,status){
  getJobDataSingle("api/services/Inspection/WorkOrderService/GetWorkOrderListApp",data,showRet,showErr);
  // console.log(JSON.stringify($api.getStorage('loginData')));
  function showRet(ret){
    // console.log("--------------------------"+status);
    // console.log(JSON.stringify(ret));
    $('#dataList').html('');
    var data = {
        list: [{
          Id:"1",
          typeStr:status,
          creationTime:"2020-09-22 18:00",
          completeTime:"2020-09-22 18:00"
        },
        {
          Id:"2",
          typeStr:"施工2",
          creationTime:"2020-09-22 18:00",
          completeTime:"2020-09-22 18:00"
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
// 初始化进行中的工单列表
function initOngoing(){
  var data = {
    status:1,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'onGoing');
}
// 待接收的工单
function initReceived(){
  var data = {
    status:2,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'received');

}

// 已完成的工单
function initCompleted(){
  var data = {
    status:2,
    pageIndex:1,
    MaxResultCount:10
  }
  showData(data,'completed');
}

function onMenu(index, el) {
  jobType = index;
  if (index == 0) {
    // 工单进行中
    initOngoing()
  } else if (index == 1) {
    // 工单待接收
    initReceived()
  } else if (index == 2) {
    // 工单已完成
    initCompleted()
  }
  onCheckMenu(el, function(){
    // console.log(123);
  });
}

// function onMenu(index, el) {
//   jobType = index;
//   if (index == 0) {
//     $('.charge').removeClass('aui-hide');
//     $('.start-time').removeClass('aui-hide');
//     $('.start-time').addClass('margin-top6');
//     $('.start-time').removeClass('margin-top10');
//
//     $('.end-time').addClass('aui-hide');
//
//     $('.line').removeClass('aui-hide');
//     $('.item-footer').removeClass('aui-hide');
//   } else if (index == 1) {
//     $('.start-time').removeClass('aui-hide');
//     $('.start-time').removeClass('margin-top6');
//     $('.start-time').addClass('margin-top10');
//
//     $('.charge').addClass('aui-hide');
//     $('.end-time').addClass('aui-hide');
//
//     $('.line').removeClass('aui-hide');
//     $('.item-footer').removeClass('aui-hide');
//   } else if (index == 2) {
//     $('.charge').removeClass('aui-hide');
//     $('.start-time').removeClass('aui-hide');
//     $('.end-time').removeClass('aui-hide');
//     $('.start-time').addClass('margin-top6');
//     $('.start-time').removeClass('margin-top10');
//
//     $('.line').addClass('aui-hide');
//     $('.item-footer').addClass('aui-hide');
//   }
//   onCheckMenu(el, function(){
//     console.log(123);
//   });
// }

// 任务详情
function onOpenJobDetail(el) {
  // console.log($(el).attr('param'));
  api.openWin({
      name: 'jobDetail',
      url: './jobDetail.html',
      pageParam: {
          type: jobType,
          Id: $(el).attr('param')
      }
  });

}

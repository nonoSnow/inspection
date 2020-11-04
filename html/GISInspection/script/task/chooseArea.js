var checkedArea;
// 是否有下一页
var areaHasNext = false;
// 当前页数
var areaPage = 1;
// 当前页数
var areaPageSize = 10;
// var areaData = [];

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  $('#areaList').html('');

  // 监听滚动
  $('#areaList-box').scroll(function() {
    var h = $(this).height(); // 可视化高度(681)
    var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
    var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

    console.log(h);

    if (h + Math.ceil(st) >= sh) {
      // 滚动到底部了
      if (areaHasNext) {
        // 有下一页
        areaPage++;
        getAreaList();
      } else {
        api.toast({
            msg: '没有更多数据了~',
            duration: 2000,
            location: 'middle'
        });
      }
    }
  })
  getAreaList();
}

function getAreaList() {
  // $('#areaList').html('');
  var param = {
    pageIndex: areaPage,
    maxResultCount: areaPageSize
  }
  console.log(JSON.stringify(param));
  api.showProgress({
    title: '加载中...',
    text: '请稍后'
  });

  getAreaListData({
    data: param,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      areaHasNext = ret.result.hasNextPage;
      var data = {
        list: ret.result.items
      }

      var str = template('areaItems', data);
      $('#areaList').append(str);
    }
  })
  // getAreaListData('api/services/Inspection/AreaService/AppGetAreaDetailsByName' ,param, showRet, showErr);
  //
  // function showRet(ret) {
  //   // 请求成功，渲染数据
  //   console.log(JSON.stringify(ret));
  //   areaHasNext = ret.result.hasNextPage;
  //
    // var data = {
    //   list: ret.result.items
    // }
    //
    // var str = template('areaItems', data);
    // $('#areaList').append(str);
  // }
  //
  // function showErr(err) {
  //   console.log(JSON.stringify(err));
  //   api.hideProgress();
  //
  //   if(err.body.error != undefined){
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //   }else{
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //   }
  // }

  // var data = {
  //   list: [
  //     {
  //       id: 1,
  //       name: '测试区域1',
  //       pipelineLength: 556.4,
  //       pointCount: 41,
  //       areaPoint: ''
  //     },
  //     {
  //       id: 2,
  //       name: '测试区域2',
  //       pipelineLength: 500.4,
  //       pointCount: 31,
  //       areaPoint: ''
  //     },
  //     {
  //       id: 3,
  //       name: '测试区域3',
  //       pipelineLength: 556.4,
  //       pointCount: 51,
  //       areaPoint: ''
  //     }
  //   ]
  // }
  // console.log(JSON.stringify(data));
  // var str = template('areaItems', data);
  // $('#areaList').append(str);
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

var devInfo;
var hasNextPage = false;
var pageIndex = 1;
// var xunData = [];
// 初始化事件为当前月

// 是否从事件详情页面来
var type;

var date = parseTime(new Date(), '{y}-{m}');
var initDate = date;
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    devInfo = api.pageParam.devInfo;
    console.log(JSON.stringify(devInfo))

    if (api.pageParam.type == 'methodDetail') {
      type = true;
    } else {
      type = false;
    }

    initBasic();
    getXunData();
    // console.log(api.winHeight);
    // console.log(api.frameHeight);
    // console.log($api.offset(header).t);
    // console.log($api.offset(header).h);
    // console.log($('#basicInfo').height());
    $('#xunjianBox').css('height', api.winHeight - $api.offset(header).h - $('#basicInfo').height() - 150);
    console.log($('#xunjianBox').height());
    $('#xunjianBox').scroll(function() {
      var h = $(this).height(); // 可视化高度(681)
      var sh = $(this)[0].scrollHeight;   //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点 (839)
      var st = $(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

      if (h + Math.ceil(st) >= sh) {
        // 滚动到底部了
        console.log('滚动到底部了');
        if (hasNextPage) {
          // 如果有下一页，则页码++
          pageIndex++;
          getXunData();
        }
      }
    })
}

// 初始化基础信息
function initBasic() {
  var dev = {};
  if (type) {
    dev.name = devInfo.deviceName;
    dev.code = devInfo.deviceCode;
    dev.point = devInfo.devicePoint;
    dev.status = devInfo.deviceStatus;
    dev.address = devInfo.address;
    dev.id = devInfo.deviceId;
  } else {
    dev = devInfo
  }

  var data = template('basic-box', dev);
  $('#basicInfo').append(data);
}

// 获取巡检记录
function getXunData() {
  // console.log(JSON.stringify(devInfo));
  // console.log(JSON.stringify(devInfo.id));
  var deviceId = devInfo.id == undefined ? devInfo.deciceId : devInfo.id;
  // console.log(deviceId);
  var param = {
    deviceId: deviceId,
    time: date,
    pageIndex: pageIndex,
    maxResultCount: 10
  }

  // console.log(JSON.stringify(param));
  getXunList('/api/services/Inspection/InspectionTaskService/AppGetInspectionRecordList', param, showRet, showErr);

  function showRet(ret) {
    // console.log(JSON.stringify(ret));
    hasNextPage = ret.result.hasNextPage;
    if (ret.result.items.length != 0) {
      $('#haveNothing').addClass('aui-hide');

      ret.result.items.forEach(function (item, index) {
        if (item.time != null || item.time != '') {
          item.time = parseTime(item.time, '{y}-{m}-{d} {h}:{i}');
        }
      })

      var data = {
        list: ret.result.items
      }
      var str = template('xun-box', data);
      $('#xunjianBox').append(str);
    } else {
      $('#haveNothing').removeClass('aui-hide');
    }
  }

  function showErr(err) {
    // console.log(JSON.stringify(err));
    if (err.body.error != undefined) {
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });
    } else {
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }

  // var data = {
  //   list: [
  //     {
  //       name: '阀门',
  //       person: '张三',
  //       time: '2020-06-02 14:00',
  //       status: 3,
  //       statusStr: '异常'
  //     },
  //     {
  //       name: '阀门',
  //       person: '李四',
  //       time: '2020-06-02 14:00',
  //       status: 2,
  //       statusStr: '正常'
  //     },
  //     {
  //       name: '阀门',
  //       person: '王五',
  //       time: '2020-06-02 14:00',
  //       status: 3,
  //       statusStr: '异常'
  //     }
  //   ]
  // }
  //
  // var str = template('xun-box', data);
  // $('#xunjianBox').append(str);
}

// 初始化
var rdS = new Rolldate({
    el: '#timeDate',
    format: 'YYYY-MM',
    beginYear: 2000,
    endYear: 2100,
    lang: {
        title: '请选择日期'
    },
    value: initDate,
    confirm: function(val) {
      // console.log('点击了确定');
      date = val;
      // console.log(date);
      pageIndex = 1;
      // xunData = [];
      $('#xunjianBox').html('');
      getXunData();
    }
})

// 打开选择月份
function startDate() {
  rdS.show();
}

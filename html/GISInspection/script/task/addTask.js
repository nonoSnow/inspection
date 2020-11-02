// 负责人
var headList = {};
var areaData = {};

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

  // 监听负责人的选择
  api.addEventListener({
      name: 'headList'
  }, function(ret, err) {
      // api.closeWin({name:'headList'})
      // 获取选中的负责人信息
      if (ret) {
        headList = JSON.parse(ret.value.checkHeadObj);
        $('#person').val(headList.name);
      }

  });

  api.addEventListener({
      name: 'checkedAreaData'
  }, function(ret, err){
      if( ret ){
          //  alert( JSON.stringify( ret ) );
          areaData = ret.value.checkedArea;
          if (areaData.name != '') {
            $('#tishiBox').addClass('aui-hide');
            $('#mapBox').removeClass('aui-hide');
          } else {
            $('#tishiBox').removeClass('aui-hide');
            $('#mapBox').addClass('aui-hide');
          }
      }else{
          //  alert( JSON.stringify( err ) );
      }
  });

}

// 进入负责人选择页面
function onOpenHead() {
    api.openWin({
        name: 'headList',
        url: '../Job/headList.html'
    });
}

// 初始化开始日期
var rdS = new Rolldate({
    el: '#planStartTime',
    format: 'YYYY-MM-DD hh:mm',
    beginYear: 2000,
    endYear: 2100,
    lang: {
        title: '请选择日期'
    }
})
// 打开开始日期选择
function openStartDate() {
  rdS.show();
}

// 初始化结束日期
var rdE = new Rolldate({
    el: '#planEndTime',
    format: 'YYYY-MM-DD hh:mm',
    beginYear: 2000,
    endYear: 2100,
    lang: {
        title: '请选择日期'
    }
})
// 打开结束日期选择
function openEndDate() {
  rdE.show();
}

// 提交
function subTask() {
  // console.log('点击了提交');

  var taskName = $('#').val();
  console.log(taskName);
  if (taskName == '') {
    // 提示没有输入任务名称
    api.toast({
        msg: '请输入任务名称',
        duration: 2000,
        location: 'middle'
    });
    return false;
  } else {
    if (hasSpecialCharts(taskName)) {
      api.toast({
          msg: '任务名称不能包含特殊字符串',
          duration: 2000,
          location: 'middle'
      });
      return false;
    }
  }

  // console.log(headList.name);
  if (headList.name == undefined) {
    // 提示没有选择负责人
    api.toast({
        msg: '请选择负责人',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }

  var planStartTime = $('#planStartTime').val();
  // console.log(planStartTime);

  if (planStartTime == '') {
    // 提示输入开始时间
    api.toast({
        msg: '请选择开始时间',
        duration: 2000,
        location: 'middle'
    });
    return false;
  } else {
    // 比较时间大小，开始时间必须从第二天开始
    var startTime = getSecondDate();
    if (!judgeTime(startTime, planStartTime)) {
      api.toast({
          msg: '任务开始时间请从第二天选择',
          duration: 2000,
          location: 'middle'
      });
      return false;
    }
  }

  var planEndTime = $('#planEndTime').val();

  if (!judgeTime(planStartTime, planEndTime)) {
    api.toast({
        msg: '结束时间必须大于开始时间',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }

  var content = $('#content').val();

  if (content == '') {
    api.toast({
        msg: '任务备注不能为空',
        duration: 2000,
        location: 'middle'
    });
    return false;
  } else {
    if (hasSpecialCharts(content)) {
      api.toast({
          msg: '任务备注不能包含特殊字符串',
          duration: 2000,
          location: 'middle'
      });
      return false;
    }
  }

  var param = {
    name: taskName,
    personId: headList.userId,
    person: headList.name,
    startTime: planStartTime,
    endTime: planEndTime,
    remark: content,
    areaId: areaData.id,
    type: 1
  }

  // console.log(JSON.stringify(param));
  addTask({
    data: param,
    success: function(ret) {
      api.closeWin({
          name: 'addTask'
      });
    }
  })
  // addTask('api/services/Inspection/InspectionTaskService/InsertTask', param, showRet, showErr);
  //
  // function showRet(ret) {
  //   // 新增成功
  //   // openTask();
  //   api.closeWin({
  //       name: 'addTask'
  //   });
  //
  // }
  //
  // function showErr(err) {
  //   // 失败
  //   if(err.body.error != undefined){
  //     // alert(err.body.error.message);
  //     api.toast({
  //         msg: err.body.error.message,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //
  //   }else{
  //     // alert(err.msg);
  //     api.toast({
  //         msg: err.msg,
  //         duration: 2000,
  //         location: 'middle'
  //     });
  //   }
  // }
}

// 跳转回任务模块
function openTask() {
  api.openWin({
      name: 'task',
      url: './task.html'
  });
}

// 跳转到选择区域
function openChoseArea() {
  api.openWin({
      name: 'chooseArea',
      url: './chooseArea.html'
  });

}

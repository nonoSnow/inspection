var headList; // 负责人信息
var jobType; // 工单类型
var source=2; // 来源：1：PC端；2：APP；3：第三方（管网）
apiready = function() {
        var header = $api.byId('header');
        // 实现沉浸式状态栏效果
        $api.fixStatusBar(header);

        // 工单类型
        $(".custom-popup-list li").each(function() {
            $(this).click(function() {
                $('#jobType').val($(this).text());
                jobType = parseInt($(this).attr("value"));
                $('.custom-popup-item').removeClass('color-598');
                $(this).addClass('color-598');
                onHidePopup();
            });
        });

        // 监听负责人的选择
        api.addEventListener({
            name: 'headList'
        }, function(ret, err) {
            // 获取选中的负责人信息
            headList = JSON.parse(ret.value.checkHeadObj);
            $('#person').val(headList.name);
        });
    }
    // 初始化日期
var rd = new Rolldate({
        el: '#planCompleteTime',
        format: 'YYYY-MM-DD hh',
        beginYear: 2000,
        endYear: 2100,
        lang: {
            title: '请选择日期'
        }
    })
    // 打开日期选择
function openDate() {
    rd.show();
}

// 工单类型
var popup = new auiPopup();
// 关闭工单类型选择框
function onHidePopup() {
    popup.hide(document.getElementById("jobTypePop"));
}

// 进入负责人选择页面
function onOpenHead() {
    api.openWin({
        name: 'headList',
        url: './headList.html'
    });
}

// 上传附件（照片）
function openCamera() {
    api.getPicture({
      sourceType: 'camera',
      mediaValue: 'pic',
      saveToPhotoAlbum: false,
    }, function(ret, err) {
        if (ret) {
            alert(JSON.stringify(ret));
            var str = '<img src="'+ret.data+'" class="margin-bot3 file-div" style="margin-left:10px;" alt="">'
            $("#picBox").append(str)
        } else {
            alert(JSON.stringify(err));
        }
    });
}

// 提交工单
function subJob(){
  // 判断工单类型是否填写
  if(!$("#jobType").val()){
    api.toast({
        msg: '请选择工单类型!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断负责人是否填写
  if(!$("#person").val()){
    api.toast({
        msg: '请选择负责人!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断预计完成时间是否填写
  if(!$("#planCompleteTime").val()){
    api.toast({
        msg: '请选择预计完成时间!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断工单内容是否填写
  if(!$("#content").val()){
    api.toast({
        msg: '请填写工单内容!',
        duration: 2000,
        location: 'middle'
    });
    return false;
  }
  // 判断巡检区域是否填写
  // 判断附件是否存在
  var data = {
    content:$("#content").val(),  //工单内容
    type:jobType,     //工单类型（1：查漏；2：查漏延伸；3：维修管道；4：维修管道延伸；5：违章罚款；6：贫水区改造）
    personId:headList.userId,            //负责人ID
    person:$("#person").val(),    //负责人名称
    status:1,                     //工单状态（1：待接收；2：进行中；3：关闭；4：已完成）
    deviceId:1,                    //设备ID
    planCompleteTime:$("#planCompleteTime").val()+":00:00",   //预计完成时间
    areaId:1,                      //区域（路线）ID
    source:source,                //来源：1：PC端；2：APP；3：第三方（管网）
    // resourceInfoList:{
    //   resourceId:,    //附件Id
    //   url:,           //附件地址
    //   fileName:,      //附件名称
    //   size:,          //附件大小
    //   type:,          //附件类型
    // }
  }
  uploadData(data);
}

// 上传数据
function uploadData(data){
  console.log(JSON.stringify(data));
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '提交中...',
      modal: false
  });
  addJobData("api/services/Inspection/WorkOrderService/InsertWorkOrder",data,showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    console.log(JSON.stringify(ret));
    if(ret.success){
      api.toast({
          msg: '新增工单成功',
          duration: 2000,
          location: 'middle'
      });
      // 清空数据
      clearData();
    }else {
      alert("新增工单失败")
    }
  }

  function showErr(err){
    api.hideProgress();
    console.log(JSON.stringify(err));
    if(err.body){
      if(err.body.error){
        api.alert({
            title: '提示',
            msg: err.body.error.message,
        });
      }else{
        alert(err.body)
      }
    }else {
      alert("加载失败")
    }
  }
}

// 清空数据
function clearData(){
  $("#content").val("");
  $('#jobType').val("");
  jobType="";
  headList={};
  $("#person").val("")
  $("#planCompleteTime").val("")
}


var bRuleIndex = nowBRuleIndex = 0;    // 查漏总数
var Id; //工单ID
var from;  //来源哪个页面
var caliberList=[];  //口径列表

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  //获取工单ID
  Id = parseInt(api.pageParam.Id);
  from = api.pageParam.from;
  // 监听caliberList
  getCaliberList();
  // 管径/口径的选择
  $(".extend-popup-list li").each(function() {
    $(this).click(function() {
      $('#caliber').val($(this).text());
      $('.extend-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideExtendPopup();
    });
  });

}

var popup = new auiPopup();
function onHideExtendPopup(){
    popup.hide(document.getElementById("caliberExtendPop"));
}
// 选择项的显示
function onShowExtendPop(el) {
  $('.extend-popup-list li').removeClass('color-598');
  var nowText = $(el).prev().val();
  if (nowText != '') {
    $(".extend-popup-list li").each(function() {
      if ($(this).text() == nowText) {
        $(this).addClass('color-598');
      }
    });
  }
  popup.show(document.getElementById("caliberExtendPop"));
}

function onAddItem() {
  var item = '';
  bRuleIndex++;
  item = "<div class='margin-top6'>" +
            "<div class='item-title'>" +
              "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
            "</div>" +
            "<div class='item-input margin-top6 relative'>" +
              "<input id='bRuleName"+ bRuleIndex +"' type='text' placeholder='请输入违章单位名称'>" +
            "</div>" +
          "</div>";
  $(".item-one").append(item);
}

function onDelecteItem(Obj) {
  Obj.parentNode.parentNode.parentNode.removeChild(Obj.parentNode.parentNode);
}

// 日期显示
// 初始化日期
var rd = new Rolldate({
  el: '#time',
  format: 'YYYY-MM-DD',
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

// 填写工单上传
function subHandle(){
  // 整理数据
  var workback=[]; // 数据
  var isHasData=false; // 有值的标志
  // 违章单位
  for (var i = 0; i <= bRuleIndex; i++) {
    var obj={
      type:"违章单位",
      company:$("#bRuleName"+i).val()
    }
    if($("#bRuleName"+i).val()){
      isHasData=true;
    }
    workback.push(obj);
  }

  // 查漏延伸


  // 判断至少有一个要填写
  if($("#caliber").val() || $("#violationAddress").val() ||$("#time").val() ||$("#projectCost").val() ||$("#waterCost").val() ||$("#violationReason").val() ||$("#remark").val() || isHasData){
    // 进入提交接口
    var data={
      id:Id,
      caliber:$("#caliber").val(),
      violationAddress:$("#violationAddress").val(),
      time:$("#time").val(),
      projectCost:$("#projectCost").val(),
      waterCost:$("#waterCost").val(),
      violationReason:$("#violationReason").val(),
      remark:$("#remark").val(),
      workback:workback
    }
    subComplete(data)
  }else{
    // 弹出提示
    api.toast({
        msg: '请至少填写一项',
        duration: 2000,
        location: 'middle'
    });
  }
}

function subComplete(data){
  // console.log(JSON.stringify(data));
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '提交中...',
      modal: false
  });
  var options={
    data:data,
    success:showRet,
    error:showErr,
  }
  // 请求接口 获取数据
  postAjaxWriteJob(options);
  // jobPostMethod("api/services/Inspection/WorkOrderService/CompleteWorkOrder",data,showRet,showErr);
  // console.log(JSON.stringify($api.getStorage('loginData')));
  function showRet(ret){
    api.hideProgress();
    // console.log(JSON.stringify(ret));
    if(ret.success){
      api.alert({
          title: '提示',
          msg: '提交成功，即将跳转到工单列表页',
      }, function(ret, err){
        api.sendEvent({
            name: 'initJob',
            extra: {
                funcName: 0,
            }
        });
        if(from=="jobDetail"){
          api.closeWin({
              name: 'jobDetail'
          });
        }
        api.closeWin()
      });

    }else{
      api.alert({
          title: '提示',
          msg: '提交失败！请稍后重试',
      });
    }
  }

  function showErr(err){
    api.hideProgress();

    // console.log(JSON.stringify(err));
    if(err.body){
      if(err.body.error){
        if(err.body.error.message){
          alert(err.body.error.message)
        }else {
          alert("加载失败")
        }
      }else {
        alert("加载失败")
      }
    }else {
      alert("加载失败");
    }
  }
}

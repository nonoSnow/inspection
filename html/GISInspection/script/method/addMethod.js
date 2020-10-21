
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);
    // 点击选择事件类型
    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        // alert($(this).text())
        $('#methodType').val($(this).text());
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });
    // 点击选择异常类型
    $(".abnormal-type-list .flex1").each(function() {
      $(this).click(function() {
          // alert($(this).text())
          $('#abnormalType').val($(this).text());
          onHideAbnormalTypPopup();
      });
    });
    onSubmit();
}
var popup = new auiPopup();
// 关闭事件类型弹窗
function onHidePopup(){
    popup.hide(document.getElementById("methodTypePop"));
}
// 关闭异常类型弹窗
function onHideAbnormalTypPopup(){
    popup.hide(document.getElementById("abnormalTypePop"));
}

// 提交事件添加
function onSubmit(){
  var data = {
    type:0,
    errorType:'',
    taskId:0,
    status:0,
    waterLoss:'',
    content:'',
    resourceInfoList:[]
  }
  getInsertEvent("api/services/Inspection/EventService/InsertEvent",data,showRet,showErr);
  function showRet(ret){
    alert(JSON.stringify(ret));
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

function onOpenArea(type) {
  api.openWin({
      name: 'area',
      url: '../area/area.html',
      pageParam: {
          type: type
      }
  });

}

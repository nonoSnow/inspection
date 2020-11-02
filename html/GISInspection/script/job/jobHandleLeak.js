
var caliberIndex = nowCaliberIndex = 0;    // 查漏总数
var caliberExtendIndex = nowCaliberExtendIndex = 0; //查漏延伸总数
var addressIndex = 0;  //地址总数
var Id; //工单ID
var from;  //来源哪个页面

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  //获取工单ID
  Id = parseInt(api.pageParam.Id);
  from = api.pageParam.from;
  $(".custom-popup-list li").each(function() {
    $(this).click(function() {
      $('#caliberType' + nowCaliberIndex).val($(this).text());
      $('.custom-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHidePopup();
    });
  });

  $(".extend-popup-list li").each(function() {
    $(this).click(function() {
      $('#caliberExtendType' + nowCaliberExtendIndex).val($(this).text());
      $('.extend-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideExtendPopup();
    });
  });

}

var popup = new auiPopup();
function onHidePopup(){
    popup.hide(document.getElementById("caliberTypePop"));
}

function onHideExtendPopup(){
    popup.hide(document.getElementById("caliberExtendPop"));
}

function onShowPop(el) {
    nowCaliberIndex = $(el).attr('itemIndex');
    $('.custom-popup-list li').removeClass('color-598');
    var nowText = $(el).prev().val();
    if (nowText != '') {
      $(".custom-popup-list li").each(function() {
        if ($(this).text() == nowText) {
          $(this).addClass('color-598');
        }
      });
    }
    popup.show(document.getElementById("caliberTypePop"));
}

function onShowExtendPop(el) {
  nowCaliberExtendIndex = $(el).attr('itemIndex');
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

function onAddItem(type) {
  var item = '';
  if (type == '0') {
    caliberIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='caliberType"+ caliberIndex +"' type='text' placeholder='请选择管径类型' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ caliberIndex +"' onclick='onShowPop(this)' tapmode></span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='caliber"+ caliberIndex +"' type='text' placeholder='请输入口径长度'>" +
                "<span class='font-S9 color-999'>m</span>" +
              "</div>" +
            "</div>";
    $(".item-one").append(item);
  } else if (type == '1') {
    caliberExtendIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative' >" +
                "<input id='caliberExtendType"+ caliberExtendIndex +"' type='text' placeholder='请选择管径类型' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ caliberExtendIndex +"' onclick='onShowExtendPop(this)' tapmode></span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='caliberExtend"+ caliberExtendIndex +"' type='text' placeholder='请输入口径长度'>" +
                "<span class='font-S9 color-999' aui-popup-for='methodTypePop'>m</span>" +
              "</div>" +
            "</div>";
    $(".item-two").append(item);
  } else if (type == '2') {
    addressIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='address"+ addressIndex +"' type='text' placeholder='请输入查漏地址'>" +
              "</div>" +
            "</div>";
    $(".item-three").append(item);
  }
}

function onDelecteItem(Obj) {
  Obj.parentNode.parentNode.parentNode.removeChild(Obj.parentNode.parentNode);
}

// 填写工单上传
function subHandle(){
  // 整理数据
  var workback=[]; // 数据
  var isHasData=false; // 有值的标志
  // 查漏整理
  for (var i = 0; i <= caliberIndex; i++) {
    if( $("#caliberType"+i).val() && $("#caliber"+i).val() ){
      var obj={
        type:"查漏",
        caliber:$("#caliberType"+i).val(),
        value:$("#caliber"+i).val()+'m'
      }
      isHasData=true;
      workback.push(obj);
    }else if(!$("#caliberType"+i).val() && !$("#caliber"+i).val()){
      continue;
    }else {
      // 弹出提示
      api.toast({
          msg: '查漏请填写完整',
          duration: 2000,
          location: 'middle'
      });
      return false
    }
  }

  // 查漏延伸
  for (var i = 0; i <= caliberExtendIndex; i++) {
     if( $("#caliberExtendType"+i).val() && $("#caliberExtend"+i).val() ){
       var obj={
         type:"查漏延伸",
         caliber:$("#caliberExtendType"+i).val(),
         value:$("#caliberExtend"+i).val()+'m'
       }
       isHasData=true;
       workback.push(obj);
     }else if(!$("#caliberExtendType"+i).val() && !$("#caliberExtend"+i).val()){
       continue;
     }else {
       // 弹出提示
       api.toast({
           msg: '查漏延伸请填写完整',
           duration: 2000,
           location: 'middle'
       });
       return false
     }
  }
  // 地址
  for (var i = 0; i <= addressIndex; i++) {
    if($("#address"+i).val()){
       isHasData=true;
       var obj={
         type:"查漏地点",
         address:$("#address"+i).val(),
       }
       workback.push(obj);
     }
  }

  // 判断至少有一个要填写
  if($("#predictWaterLoss").val() || isHasData){
    // 进入提交接口
    var data={
      id:Id,
      predictWaterLoss:$("#predictWaterLoss").val(),
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
  jobPostMethod("api/services/Inspection/WorkOrderService/CompleteWorkOrder",data,showRet,showErr);
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

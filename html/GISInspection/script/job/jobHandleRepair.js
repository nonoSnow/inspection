
var repairIndex = nowRepairIndex = 0;    // 维修总数
var changeIndex = nowChangeIndex = 0; //改管总数
var valveIndex = nowValveIndex = 0; //阀门总数
var hydrantIndex = nowHydrantIndex = 0; //消防栓总数
var addressIndex = 0;  //地址总数
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

  $(".custom-popup-list li").each(function() {
    $(this).click(function() {
      $('#repairType' + nowRepairIndex).val($(this).text());
      $('.custom-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideRepairPopup();
    });
  });

  $(".extend-popup-list li").each(function() {
    $(this).click(function() {
      $('#changeType' + nowChangeIndex).val($(this).text());
      $('.extend-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideChangePopup();
    });
  });

  // 阀门valve-popup-list
  $(".valve-popup-list li").each(function() {
    $(this).click(function() {
      $('#valveType' + nowValveIndex).val($(this).text());
      $('.valve-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideValvePopup();
    });
  });

  // 消防栓 hydrant
  $(".hydrant-popup-list li").each(function() {
    $(this).click(function() {
      $('#hydrantType' + nowHydrantIndex).val($(this).text());
      $('.hydrant-popup-item').removeClass('color-598');
      $(this).addClass('color-598');
      onHideHydrantPopup();
    });
  });

}

var popup = new auiPopup();
function onHideRepairPopup(){
    popup.hide(document.getElementById("repairTypePop"));
}

function onHideChangePopup(){
    popup.hide(document.getElementById("changePop"));
}
// 阀门 valve
function onHideValvePopup(){
    popup.hide(document.getElementById("valvePop"));
}
// 消防栓
function onHideHydrantPopup(){
    popup.hide(document.getElementById("hydrantPop"));
}

function onShowPop(el) {
    nowRepairIndex = $(el).attr('itemIndex');
    $('.custom-popup-list li').removeClass('color-598');
    var nowText = $(el).prev().val();
    if (nowText != '') {
      $(".custom-popup-list li").each(function() {
        if ($(this).text() == nowText) {
          $(this).addClass('color-598');
        }
      });
    }
    popup.show(document.getElementById("repairTypePop"));
}

function onShowExtendPop(el) {
  nowChangeIndex = $(el).attr('itemIndex');
  $('.extend-popup-list li').removeClass('color-598');
  var nowText = $(el).prev().val();
  if (nowText != '') {
    $(".extend-popup-list li").each(function() {
      if ($(this).text() == nowText) {
        $(this).addClass('color-598');
      }
    });
  }
  popup.show(document.getElementById("changePop"));
}

// 阀门 onShowValvePop valve
function onShowValvePop(el) {
  nowValveIndex = $(el).attr('itemIndex');
  $('.valve-popup-list li').removeClass('color-598');
  var nowText = $(el).prev().val();
  if (nowText != '') {
    $(".valve-popup-list li").each(function() {
      if ($(this).text() == nowText) {
        $(this).addClass('color-598');
      }
    });
  }
  popup.show(document.getElementById("valvePop"));
}

// hydrant 消防栓
function onShowHydrantPop(el) {
  nowHydrantIndex = $(el).attr('itemIndex');
  $('.hydrant-popup-list li').removeClass('color-598');
  var nowText = $(el).prev().val();
  if (nowText != '') {
    $(".hydrant-popup-list li").each(function() {
      if ($(this).text() == nowText) {
        $(this).addClass('color-598');
      }
    });
  }
  popup.show(document.getElementById("hydrantPop"));
}

function onAddItem(type) {
  var item = '';
  if (type == '0') {
    repairIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='repair"+ repairIndex +"' type='text' placeholder='请输入维修长度'>" +
                "<span class='font-S9 color-999'>m</span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='repairType"+ repairIndex +"' type='text' placeholder='请选择口径' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ repairIndex +"' onclick='onShowPop(this)' tapmode></span>" +
              "</div>" +
            "</div>";
    $(".item-one").append(item);
  } else if (type == '1') {
    changeIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative' >" +
                "<input id='change"+ changeIndex +"' type='text' placeholder='请输入改管长度'>" +
                "<span class='font-S9 color-999' aui-popup-for='methodTypePop'>m</span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='changeType"+ changeIndex +"' type='text' placeholder='请选择口径' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ changeIndex +"' onclick='onShowExtendPop(this)' tapmode></span>" +
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
                "<input id='address"+ addressIndex +"' type='text' placeholder='请输入贫困区改造地点'>" +
              "</div>" +
            "</div>";
    $(".item-three").append(item);
  }else if (type == '3') {
    valveIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative' >" +
                "<input id='valve"+ valveIndex +"' type='text' placeholder='请输入阀门数量'>" +
                "<span class='font-S9 color-999' aui-popup-for='methodTypePop'>只</span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='valveType"+ valveIndex +"' type='text' placeholder='请选择口径' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ valveIndex +"' onclick='onShowValvePop(this)' tapmode></span>" +
              "</div>" +
            "</div>";
    $(".item-four").append(item);
  } else if (type == '4') {
    hydrantIndex++;
    item = "<div class='margin-top6'>" +
              "<div class='item-title'>" +
                "<img src='../../image/delete.png' tapmode onclick='onDelecteItem(this)' class='item-img'>" +
              "</div>" +
              "<div class='item-input margin-top6 relative' >" +
                "<input id='hydrant"+ hydrantIndex +"' type='text' placeholder='请输入消防栓数量'>" +
                "<span class='font-S9 color-999' aui-popup-for='methodTypePop'>只</span>" +
              "</div>" +
              "<div class='item-input margin-top6 relative'>" +
                "<input id='hydrantType"+ hydrantIndex +"' type='text' placeholder='请选择口径' readonly>" +
                "<span class='aui-iconfont aui-icon-down font-S9' itemIndex='"+ hydrantIndex +"' onclick='onShowHydrantPop(this)' tapmode></span>" +
              "</div>" +
            "</div>";
    $(".item-five").append(item);
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
  // 维修整理
  for (var i = 0; i <= repairIndex; i++) {
    if( $("#repairType"+i).val() && $("#repair"+i).val() ){
      var obj={
        type:"维修",
        caliber:$("#repairType"+i).val(),
        value:$("#repair"+i).val()+'m'
      }
      isHasData=true;
      workback.push(obj);
    }else if(!$("#repairType"+i).val() && !$("#repair"+i).val()){
      continue;
    }else {
      // 弹出提示
      api.toast({
          msg: '维修请填写完整',
          duration: 2000,
          location: 'middle',
      });
      return false
    }
  }

  // 改管
  for (var i = 0; i <= changeIndex; i++) {
     if( $("#changeType"+i).val() && $("#change"+i).val() ){
       var obj={
         type:"改管",
         caliber:$("#changeType"+i).val(),
         value:$("#change"+i).val()+'m'
       }
       isHasData=true;
       workback.push(obj);
     }else if(!$("#changeType"+i).val() && !$("#change"+i).val()){
       continue;
     }else {
       // 弹出提示
       api.toast({
           msg: '改管请填写完整',
           duration: 2000,
           location: 'middle'
       });
       return false
     }
  }

  // 阀门 valve
  for (var i = 0; i <= valveIndex; i++) {
     if( $("#valveType"+i).val() && $("#valve"+i).val() ){
       var obj={
         type:"阀门",
         caliber:$("#valveType"+i).val(),
         value:$("#valve"+i).val()+"只"
       }
       isHasData=true;
       workback.push(obj);
     }else if(!$("#valveType"+i).val() && !$("#valve"+i).val()){
       continue;
     }else {
       // 弹出提示
       api.toast({
           msg: '阀门请填写完整',
           duration: 2000,
           location: 'middle'
       });
       return false
     }
  }

  // 消防栓 hydrant
  for (var i = 0; i <= hydrantIndex; i++) {
     if( $("#hydrantType"+i).val() && $("#hydrant"+i).val() ){
       var obj={
         type:"消防栓",
         caliber:$("#hydrantType"+i).val(),
         value:$("#hydrant"+i).val()+'只'
       }
       isHasData=true;
       workback.push(obj);
     }else if(!$("#hydrantType"+i).val() && !$("#hydrant"+i).val()){
       continue;
     }else {
       // 弹出提示
       api.toast({
           msg: '消防栓请填写完整',
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
         type:"贫困区改造地点",
         address:$("#address"+i).val(),
       }
       workback.push(obj);
     }
  }

  // 判断至少有一个要填写
  if($("#predictWaterLoss").val() || isHasData){
    console.log($("#predictWaterLoss").val());
    console.log(JSON.stringify(workback));
    // return false;
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
  console.log(JSON.stringify(data));
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
    console.log(JSON.stringify(ret));
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

    console.log(JSON.stringify(err));
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

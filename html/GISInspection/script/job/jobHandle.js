
var caliberIndex = nowCaliberIndex = 0;
var caliberExtendIndex = nowCaliberExtendIndex = 0;
var addressIndex = 0;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);

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

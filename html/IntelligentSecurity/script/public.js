
function onBack() {
  api.closeWin({});
}

/*
 *  头部-类型点击公共方法
 */
function onCheckMenu(el, callback) {

  $('.header-type-item').removeClass('color-598');
  $('.type-line').removeClass('bgc-blue');

  $(el).addClass('color-598');
  $(el).children().children().addClass('bgc-blue');

  callback();
}


var oTop = 0;
var oH;

/*
 *  列表伸缩动画 -- 点击事件
 *  默认显示的元素高度 -- height+margin+padding+border
 *  第一条列表高度 -- height+margin+padding+border
 *  当前列表动画状态
 *  回调函数
 *
 */
function onShowList(element, minH, maxH, mapListStatus, bodyHeight,callback) {
    oTop = 0;
    if (mapListStatus == 0) {
        $('.' + element).css('height', minH + maxH + 'px');
    } else if (mapListStatus == 1) {
        $('.' + element).css('height', bodyHeight + 'px');
    } else if (mapListStatus == 2) {
        $('.' + element).css('height', minH + 'px');
    }

    mapListStatus++;
    if (mapListStatus > 2) {
        mapListStatus = 0;
    }
    callback(mapListStatus);
}

/*
 *  列表伸缩动画 -- 拖拽事件
 */
 function onMoveShowList(el, element,minH, maxH, mapListStatus, bodyHeight, callback) {
   el.addEventListener("touchstart", function(e) {
       var touches = e.touches[0];
       oH = touches.clientY - el.offsetTop;
   }, false);

   el.addEventListener("touchmove", function(e) {
       var touches = e.touches[0];
       oTop = touches.clientY - oH;
       if (oTop < 25) {
           $('.' + element).css('height', bodyHeight + 'px');
       } else if (oTop > bodyHeight * 0.8) {
           $('.' + element).css('height', minH + 'px');
       } else {
           $('.' + element).css('height', bodyHeight - oTop + 'px');
       }
   }, false);

   el.addEventListener("touchend",function() {
       if (oTop != 0) {
         if (oTop < bodyHeight * 0.3) {
             $('.' + element).css('height', bodyHeight + 'px');
             mapListStatus = 2;
         } else if (bodyHeight - oTop < 160) {
             $('.' + element).css('height', minH + 'px');
             mapListStatus = 0;
         } else {
             $('.' + element).css('height', minH + maxH + 'px');
             mapListStatus = 1;
         }

         callback(mapListStatus);
       }
   },false);

 }
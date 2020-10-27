
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

/**
* 获取照片
* @param {type} 类型（相册或者拍照）
**/
function getPicture(type, showRet, showErr) {
  api.getPicture({
    sourceType: type,
    encodingType: 'jpg',
    mediaValue: 'pic',
    destinationType: 'url',
    allowEdit: true,
    quality: 60,
    targetWidth: 750,
    targetHeight: 750,
    saveToPhotoAlbum: false
  }, function(ret, err) {
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(err));
      if (ret) {
          if (ret.data != '') {
            uploadPic(ret.data, success, error);
            function success(ret) {
              showRet(ret);
            }

            function error(err) {
              showErr(err)
            }
          } else {
            showErr({
              code: 0,
              message: '没有选择图片'
            })
          }

      } else {
          alert(JSON.stringify(err));
          showErr(err);
      }
  });
}

/**
* 上传图片
* @param {path} 图片路径，单图片上传
**/
function uploadPic(path, success, error) {
  console.log(path);
  var data = {
    files: path
  }
  upLoadPicture('api/UploadFiles/UploadProfilePicture', data, showRet, showErr);

  function showRet(ret) {
    if (ret.success) {
      success(ret.result.items);
    }
  }

  function showErr(err) {
    error(err);
  }
}

/**
* 删除数组中指定的元素
* @param {data} 数组
* @param {startIndex} 开始下标
* @param {length} 删除长度
**/
function deleteArray(data, startIndex, length) {
  var len = length || 1;
  console.log(len);
  console.log(JSON.stringify(data));
  console.log(startIndex);
  data.splice(startIndex, len);
  return data;
}

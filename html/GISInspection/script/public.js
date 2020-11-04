
function onBack() {
  api.closeWin({});
}

/*
 *  键盘弹起，底部状态栏被顶起
 *  elArr -- 底部状态栏 id 数组   ['footer1', 'footer2']
 */

function WinSize(elArr) {
  var winHeight = $(window).height(); //获取当前页面高度
  $(window).resize(function(){
        //当窗体大小变化时
        var thisHeight = $(this).height();  //窗体变化后的高度
        setTimeout(function() {
          if (winHeight - thisHeight > 50) {
              $('body').css('height', thisHeight + 'px');
              for (var i = 0; i < elArr.length; i++) {
                //修改底部按钮条的位置
                $("#" + elArr[i]).css("bottom", "-100px");
              }
          } else {
              $('body').css('height', '100%');
              for (var i = 0; i < elArr.length; i++) {
                //修改底部按钮条的位置
                $("#" + elArr[i]).css("bottom", "0px");
              }
          }
        }, 200);
  });
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
    console.log(maxH);
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
        console.log(maxH);
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
    // console.log(JSON.stringify(ret));
    // console.log(JSON.stringify(err));
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
  // console.log(path);
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
  // console.log(len);
  // console.log(JSON.stringify(data));
  // console.log(startIndex);
  data.splice(startIndex, len);
  return data;
}

/**
* 判断结束时间是否大于等于开始时间
* @param {String} startTime 开始时间
* @param {String} endTime 结束时间
* @param {Num} period 间隔周期（小时）,结束时间是否大于等于开始时间多少小时
**/
function judgeTime(startTime, endTime, period) {
  // 开始的时间
  let startDate = new Date(startTime);
  let start = startDate.valueOf();
  // 结束时间
  let endDate = new Date(endTime);
  let end = endDate.valueOf();

  if (period == undefined) {
    if (end >= start) {
      return true;
    } else {
      return false;
    }
  } else {
    let intervalTime = period * 60 * 60 * 1000;
    start = start + intervalTime;
    if (end >= start) {
      return true;
    } else {
      return false;
    }
  }
}


/**
* Parse the time to string时间日期格式转换
* @param {(Object|string|number)} time
* @param {string} cFormat
* @returns {string | null}
**/
function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else if (!time.includes('T')) {
        // 判断传入进来的时间字符串是否包含 T 字符，这是时间格式，可以直接使用new Date转换，不需要操作字符串，例：1.2020-01-13T16:00:00  2.2020-01-13T16:00:00.000Z
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
* 获取当前时间第二天零点的时间
**/
function getSecondDate() {
  // 获取今天的日期
  var curentDate = parseTime(new Date(), '{y}-{m}-{d}');
  // 将今天的日期转变为今天的零点
  curentDate = new Date(parseTime(curentDate, '{y}-{m}-{d} {h}:{i}:{s}'));

  // 后一天
  var nextDate =  new Date(curentDate.getTime() + 24*60*60*1000);
  return nextDate;
}


/**
* 验证输入内容是否包含特殊字符
* @param {data} 字符串
**/
function hasSpecialCharts(data) {
  var reg = /[\'\"\\<>;&=#]/;
  return reg.test(data);
}

/**
* 上传人员当前定位
**/
var timer = null;
function uploadLocation() {


  // timer = setInterval(function(){
  //   console.log('----------------------------------');
  //   console.log("不管跳转到哪个页面,我一直在");
  // }, 5000);
}

// 预览
// function previewimg(that) {
//   if (that != null) {
//     var list = JSON.parse($(that).attr('parse'));
//     list.forEach(function(item) {
//
//     })
//     // var data = [];
//     // data.push(imgSrc);
//     previewImage(data);
//   }
// }


/**
* 图片预览
* @param {data} Array 图片路径 ['imgSrc1', 'imgsrc2']
**/
function previewImage(data) {
  var photoBrowser = api.require('photoBrowser');
  photoBrowser.open({
      images: data,
      // placeholderImg: 'widget://res/img/apicloud.png',
      bgColor: '#000'
  }, function(ret, err) {
      if (ret) {
          console.log(JSON.stringify(ret));
          if (ret.eventType == 'click') {
            // 点击，关闭预览
            photoBrowser.close();
          }
      } else {
          console.log(JSON.stringify(err));
      }
  });
}

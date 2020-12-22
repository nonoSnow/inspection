
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
    // console.log(bodyHeight);
    // console.log(maxH);
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
        // console.log(maxH);
         callback(mapListStatus);
       }
   },false);

 }

/**
* 获取照片
* @param {type} 类型（相册或者拍照）
**/
function getPicture(type, showRet, showErr) {
  // console.log(type);
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
            // console.log('没有选择图片');
            // showErr({
            //   code: 0,
            //   statusCode: 0,
            //   msg: '没有选择图片',
            //   body: '没有选择图片'
            // })
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
    // console.log(time);
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


  timer = setInterval(function(){
    // console.log('----------------------------------');
    // console.log("不管跳转到哪个页面,我一直在");
  }, 5000);
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
          // console.log(JSON.stringify(ret));
          if (ret.eventType == 'click') {
            // 点击，关闭预览
            photoBrowser.close();
          }
      } else {
          // console.log(JSON.stringify(err));
      }
  });
}

/**
 * @method getHomeTaskList 请求接口改变员工离线、在线状态
 */
function setOnlineStatus(status) {
  // console.log(status);
  // console.log(status == 1 ? false : true);
  var userInfo = $api.getStorage('userLoginInformation');
  // console.log(JSON.stringify(userInfo.currentUserInfo.userInfo.userId));
  var param = {
    IsOnline: status == 1 ? false : true,
    userId: userInfo.currentUserInfo.userInfo.userId
  }

  // console.log(JSON.stringify(param));
    insertPersonStatus({
        data: {
            IsOnline: status == 1 ? false : true,
            userId: userInfo.currentUserInfo.userInfo.userId
        },
        success: function(ret) {
            memberStatus = status == 1 ? 0 : 1;
            $api.setStorage('isOnline', memberStatus);
            // console.log($api.getStorage('isOnline'));
            if (memberStatus) {
                $(".member-status").addClass('on');
            } else {
                $(".member-status").removeClass('on');
            }
            // console.log(getCurrentUserRoles());
            sendInspectionLocation();
            if (getCurrentUserRoles()) {
              // 为领导时
              // console.log('为领导');
              api.sendEvent({
                  name: 'sendLeaderLocation',
              });
            } else {
              // 为员工时
              api.sendEvent({
                  name: 'sendPersonLocation',
              });
            }
        },
        fail: function(err) {
            // console.log(JSON.stringify(err));
            // if (err.body.error != undefined) {
            //   api.toast({
            //       msg: err.body.error.message,
            //       duration: 2000,
            //       location: 'middle'
            //   });
            //
            // } else {
            //   api.toast({
            //       msg: err.msg,
            //       duration: 2000,
            //       location: 'middle'
            //   });
            // }
            if (err == undefined) {
              api.toast({
                  msg: '数据加载失败',
                  duration: 2000,
                  location: 'middle'
              });
            } else if (err.body == undefined) {
              api.toast({
                  msg: err.msg,
                  duration: 2000,
                  location: 'middle'
              });
            } else if (err.body.error != undefined) {
              api.toast({
                  msg: err.body.error.message,
                  duration: 2000,
                  location: 'middle'
              });
            } else {
              api.toast({
                  msg: err.msg,
                  duration: 2000,
                  location: 'middle'
              });
            }
        }
    })
}

// 实时更新当前人员定位
function InsertPersonLocation() {
  // console.log('要实时更新当前人员定位了');
  var nativeTimer = api.require('nativeTimer');
  // console.log(JSON.stringify(nativeTimer));
  var params = {
      interval: 250,
      cycle: true,
      delay: 0,
  }
  nativeTimer.acquireCpu();
  // console.log('走到这一步了');
  // console.log(nativeTimer.start);
  nativeTimer.start(params, function(ret) {
    // console.log(111111111111111111111);
    // console.log(JSON.stringify(ret));
      var ids = [];
      ids.push(ret.id);
      if ($api.getStorage('isOnline') == "1") {
        // console.log('上传定位');
          sendInspectionLocation();
      } else {
        // console.log('不上传定位');
          nativeTimer.stop({
              ids: ids
          })
          nativeTimer.releaseCpu();
      }
  });
}

// 实时更新当前人员定位
function sendInspectionLocation() {
  var userLoginInformation = $api.getStorage('userLoginInformation');
  var bMap = api.require('bMap');
  // console.log(JSON.stringify(aMapLBS));
  // console.log(aMapLBS.singleLocation);
  bMap.getLocation({
    accuracy: '100m',
    autoStop: true,
    filter: 1
  }, function(ret, err) {
      if (ret.status) {
          // console.log(JSON.stringify(ret));
          var location = bd09towgs84(ret.lon, ret.lat);
          var data = {
              personId: userLoginInformation.currentUserInfo.userInfo.userId,
              person: userLoginInformation.currentUserInfo.userInfo.userName,
              location:location[0]+','+ location[1]
          };
          insertLocation({
            data: data,
            success: function(ret) {
              // console.log(JSON.stringify(ret));
            }
          });
      } else {
          // console.log(err.code);
      }
  });
}

// 监听应用从后台进入前台，去判断后端是否已经修改了改人员为离线状态，如果修改了，且本身处于在线状态，则将该人员改为在线状态
function checkOnline() {
  var userLoginInformation = $api.getStorage('userLoginInformation');
  var data = {
    userId: userLoginInformation.currentUserInfo.userInfo.userId,
  }
  getUserStatus({
    data: data,
    success: function(ret) {
      // console.log(JSON.stringify(ret));
      // 当前缓存中最后的在线状态
      var storeageIsOnline = $api.getStorage('isOnline');
      if (getCurrentUserRoles()) {
        // console.log(storeageIsOnline == ret.result.isOnline);
        // 为领导，如果返回的和缓存的状态不一致，则执行在线操作
        if (storeageIsOnline == ret.result.isOnline) {
          // 状态一致，不执行操作
        } else {
          setOnlineStatus(0);
        }
      } else {
        // 为员工，如果缓存在线返回的不在线，则执行在线操作，如果缓存离线返回在线则执行离线操作
        // console.log(storeageIsOnline == ret.result.isOnline);
        if (storeageIsOnline) {
          // 在线
          if (storeageIsOnline == ret.result.isOnline) {
            // 状态一致，不执行操作
          } else {
            // 状态不一致，执行在线操作
            setOnlineStatus(0);
          }
        } else {
          // 不在线
          if (storeageIsOnline == ret.result.isOnline) {
            // 状态一致，不执行操作
          } else {
            // 状态不一致，执行离线操作
            setOnlineStatus(1);
          }
        }
      }
    }
  });
}

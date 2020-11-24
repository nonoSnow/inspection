// 获取当前登录人员的信息
var userLoginInformation = $api.getStorage('userLoginInformation');

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);
    // 绘制地图
    indexMap = new Map({
        mapid: 'leaderMap'
    });
    initPageEvents();
}


function initPageEvents() {
    // 人员列表
    $('.OpenUserList').on('click', function() {
        onOpenUserList();
    });
    // 人员定位  获取所有人的位置及在线信息
    $('.PersonsLoction').on('click', function() {
        getPersonsLoction();
    });
    // 上报事件
    $('.OpenReport').on('click', function() {
        onOpenReport();
    });
    $('.right-item-item').on('click', function() {
        if ($(this).attr('type') == 'add') {
            indexMap.changeAreaScale(1); //放大地图
        } else {
            indexMap.changeAreaScale(0); //缩小地图
        }
    });
    // 点击定位图标将员工的位置定位到屏幕中间
    $(".map-location-div").on('click', function() {
        getMemberLocation(function(location) {
            location = [parseFloat(location[0]), parseFloat(location[1])]
            var position = [];
            position.push(location);
            $(".map-member-img").css({
                opacity: 1
            })
            indexMap.addOverLayer({
                dom: '#map-member-img',
                position: position,
                offset: [38.5, -43.5],
                // isCenter: true,
                name: 'memberlay',
                // centerPosition: location
            });
            indexMap.map.getView().setCenter(location);
            indexMap['memberlay']['0'].setPosition(location);
        });
    });
}

function onOpenUserList() {
    api.openWin({
        name: 'userList',
        url: './userList.html',
        pageParam: {
            name: 'test'
        }
    });
}

// 返回云平台首页
function toHome() {
  // console.log('点击了关闭');
  // api.closeWin({
  //   name:'inspectionMain'
  // });
  api.closeWin();
  api.closeFrame({
    name: 'group1'
  });
    // api.closeWin({});
    // api.closeToWin({
    //   name: 'main'
    // })
    // setTimeout(function() {
    //   api.closeWin({});
    // }, 500);

    // api.openWin({
    //     name: 'cloudMain',
    //     url: 'widget://html/main.html', //fs://wgt/public/html/main.html', //'../../html/main.html'
    //     bounces: false,
    //     reload: true,
    //     slidBackEnabled: false,
    //     animation: {
    //         type: "reveal", //动画类型（详见动画类型常量）
    //         subType: "from_bottom", //动画子类型（详见动画子类型常量）
    //         duration: 300 //动画过渡时间，默认300毫秒
    //     }
    // });
}

// 获取所有人员定位
function getPersonsLoction() {
  // console.log('点击了人员');
    var data = {
        oneDay: "",
        userId: userLoginInformation.currentUserInfo.userInfo.userId,
        userName: ""
    }
    var options = {
        url: requestUrl + 'PersonService/AppGetAllLocationAndTaskAndWorkOrderLists',
        type: "post",
        data: data,
        success: function(ret) {
          // console.log(JSON.stringify(ret));
            if (ret.success) {
                // var location = [106.44257422295854, 29.461625125595196];
                // var result = ret.result.items.map(function(item) {
                //     location[0] = location[0] + 0.1;
                //     location[1] = location[1] + 0.1;
                //     item.location = [location[0], location[1]];
                //     return item;
                // });
                var result = ret.result.items;
                indexMap.renderAllPersionToMap(result, function(ret) {
                  console.log(ret);
                  if(ret==null){
                    $('body .personDetail_popup').remove();
                    $('body .homePage_order_list_box').remove();
                    return false;
                  }
                    var data = {
                        result: {
                            taskLists: ret.taskLists,
                            workOrderLists: ret.workOrderLists
                        }
                    };
                    renderOrderOrworkTemplate(data);
                    var templateData = {
                        userId: ret.userId,
                        userName: ret.userName,
                        mobile: ret.mobile,
                        isOnline: ret.isOnline,
                        onlineTime: ret.onlineTime,
                        offlineTime: ret.offlineTime,
                        duration: ret.duration,
                        location: ret.location
                    };
                    if (templateData.onlineTime != null && templateData.onlineTime != "") {
                        templateData.onlineTime = moment(templateData.onlineTime).format('YYYY-MM-DD HH:mm');
                    }
                    if (templateData.offlineTime != null && templateData.offlineTime != "") {
                        templateData.offlineTime = moment(templateData.offlineTime).format('YYYY-MM-DD HH:mm');
                    }

                    $('body .personDetail_popup').remove();
                    var str = template('personDetailPopupTemplate', templateData);
                    $('body').append(str);
                    if ($('body .personDetail_popup').length != 0) {
                        indexMap.addOverlayToMap(templateData.location);
                    }
                });
            }
        },
        error: function(err) {},

    }
    ajaxMethod(options);
}

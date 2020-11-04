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

// 获取所有人员定位
function getPersonsLoction() {
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

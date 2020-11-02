
// 工单及任务总列表   工单列表    任务列表
var taskOrderList = [], orderList = [], taskList = [], resultIndex = 0;
var indexMap = {}, memberStatus = 0, activeDevice = '';
var userRoute = [{
    Location: "104.144765,30.01259",
    taskId: null,
    taskName: "",
    CreationTime: "08:21:13"
}, {
    Location: "104.134716,30.014519",
    taskId: null,
    taskName: "",
    CreationTime: "09:05:10"
}, {
    Location: "104.148385,29.984948",
    taskId: null,
    taskName: "",
    CreationTime: "09:10:28"
}, {
    Location: "104.148231,29.984775",
    taskId: null,
    taskName: "",
    CreationTime: "09:11:16"
}]
apiready = function() {

    // 初始化地图
    indexMap = new Map({
        mapid: 'maphome'
    });
    indexMap.initArea();
    indexMap.initDeviceLayer()
    indexMap.initLineOrbit()
    drawOrditOnMap(userRoute);
    drawAnmateByOribt(userRoute);
    // 实现沉浸式状态栏效果
    var header = $api.byId('header');
    $api.fixStatusBar(header);

    // 初始化员工在线、离线状态
    memberStatus = $api.getStorage('isOnline');
    memberStatus = memberStatus ? memberStatus : 0;
    $(".member-status").addClass(memberStatus ? 'on' : '');
    console.log(memberStatus);
    api.sendEvent({
        name: 'isOnline',
        extra: {
            memberStatus
        }
    });

    // 获取当前用户的位置 并向地图中添加
    setCurrentMapLocation();
    drawOrditOnMap(userRoute);
    drawAnmateByOribt(userRoute);

    // 缩放地图事件
    $(".map-scale-btn").on('click', function() {
        if($(this).hasClass('up')) {
            indexMap.changeAreaScale(1);
        } else {
            indexMap.changeAreaScale(0);
        }
    });

    // 改变员工在线、离线状态
    $(".member-status").on('click', function() {
        setOnlineStatus(memberStatus);
    });

    // 点击定位图标将员工的位置定位到屏幕中间
    $(".map-location-div").on('click', function() {
        getMemberLocation(function(location) {
            indexMap.map.getView().setCenter(location);
            indexMap['memberlay']['0'].setPosition(location);
        });
    })

    //获取当前用户正在进行的
    getHomeTaskList();
    getHomeOrderList();
    drawAreaList()
}
// pc调试使用
// 初始化地图
// indexMap = new Map({
//     mapid: 'maphome'
// });
// indexMap.initArea();
// drawAreaList();
// indexMap.initLineOrbit()
// drawOrditOnMap(userRoute);
// // drawAnmateByOribt(userRoute);
// slideMemberAnimate()

// // setCurrentMapLocation();
// indexMap.initDeviceLayer()
// // 点击定位图标将员工的位置定位到屏幕中间
// $(".map-location-div").on('click', function() {
//     // getMemberLocation(function(location) {
//         console.log(111)
//         indexMap.map.getView().setCenter([106.54258025120019,29.561620073599133]);
//         // indexMap['memberlay']['0'].setPosition([106.54258025120019,29.561620073599133]);
//     // });
// })

$(".home-device").on('click', function() {
    var feature = indexMap.selectFeature;
    if(!feature) return false;
    if(feature.ol_uid == activeDevice) return false;
    activeDevice = feature.ol_uid;
    indexMap.getTypeList();
    indexMap.getCommonEle({
        areaPoint: indexMap.selectAreaPoint,
        lineList: [{
            address: "龙滩大道",
            deviceCode: "JL42989",
            deviceName: "PE",
            devicePoint: "104.15175503500001,30.022156074999998",
            id: 109,
            status: 2,
            statusStr: "正常",
            type: 2,
            typeStr: "管道"
        }, {
            address: "龙滩大道",
            deviceCode: "JL42993",
            deviceName: "PE",
            devicePoint: "104.15172146500001,30.02224485",
            id: 110,
            status: 3,
            statusStr: "异常",
            type: 2,
            typeStr: "管道"
        }],
        pointList: [{
            address: "八里街",
            deviceCode: "JS34550",
            deviceName: "水表",
            devicePoint: "104.15256216,30.02097013",
            id: 308,
            status: 2,
            statusStr: "正常",
            type: 1,
            typeStr: "设备点"
        }, {
            address: "八里街",
            deviceCode: "JS34553",
            deviceName: "闸阀",
            devicePoint: "104.15298288,30.02062342",
            id: 854,
            status: 2,
            statusStr: "正常",
            type: 1,
            typeStr: "设备点"
        }]
    })

})

/**
* @method setCurrentMapLocation 设置当前员工在地图上
*/
function setCurrentMapLocation() {
    getMemberLocation(function(location) {
        var location = [106.54258025120019,29.561620073599133];
        location = [parseFloat(location[0]), parseFloat(location[1])]
        var position = [];
        position.push(location);
        $(".map-member-img").css({opacity: 1})
        indexMap.addOverLayer({
            dom: '#map-member-img',
            position: position,
            offset: [38.5, -43.5],
            // isCenter: true,
            name: 'memberlay',
            // centerPosition: location
        })
    });
}

/**
* @method getHomeTaskList 请求接口改变员工离线、在线状态
*/
function setOnlineStatus(status) {
    insertPersonStatus({
        data: {
            IsOnline: status ? false : true
        },
        success: function(ret) {
            memberStatus = status ? 0 : 1;
            $api.setStorage('isOnline', memberStatus);
            api.sendEvent({
                name: 'isOnline',
                extra: {
                    memberStatus
                }
            });

            if(memberStatus) {
              console.log(memberStatus);
                $(".member-status").addClass('on');
            } else {
                $(".member-status").removeClass('on');
            }
        },
        fail: function(err) {
            console.log(JSON.stringify(err))
        }
    })
}

/**
* @method getHomeTaskList 查询用户负责和参与的任务信息实体方法
*/
function getHomeTaskList() {
    getTaskInfoList({
        success: function(ret) {
            resultIndex++
            console.log(JSON.stringify(ret))
            taskOrderList = taskOrderList.concat(ret.result);
        },
        fail: function(ret) {
            console.log(JSON.stringify(ret))
            resultIndex++;
        }
    });
}

/**
* @method getHomeOrderList 查询用户负责的工单实体方法
*/
function getHomeOrderList() {
    getOrderList({
        success: function(ret) {
            resultIndex++
            console.log(JSON.stringify(ret))
            taskOrderList = taskOrderList.concat(ret.result);
        },
        fail: function(ret) {
            console.log(JSON.stringify(ret))
            resultIndex++;
        }
    });
}

/**
* @method drawAreaList 根据人员工单、任务的返回的区域在地图上绘制区域
*/
function drawAreaList() {
    resultIndex = 2;
    taskOrderList = [{
        areaPoint: "104.15865182876587,30.02561330795288;104.14976835250854,30.021836757659912;104.15388822555542,30.018188953399658;104.15903806686401,30.018060207366943;104.15908098220825,30.020549297332764;104.15869474411011,30.02359628677368;104.15865182876587,30.02561330795288;"
    }, {
        areaPoint: "104.15302991867065,30.023317337036136;104.14753675460815,30.019583702087406;104.15122747421265,30.01739501953125;104.1548752784729,30.017309188842773;104.15496110916138,30.01889705657959;104.15405988693237,30.0216007232666;104.15302991867065,30.023317337036136;"
    }];
    if(resultIndex >= 2 && taskOrderList.length > 0 ) {
        indexMap.drawAreaSelect(taskOrderList);
        indexMap.initMapClick();
    }
}

// 根据人员位置列表会绘制人员轨迹
function drawOrditOnMap(userRoute) {
    for(var i = 0; i<userRoute.length; i++) {
        var coordinates = [];
        for( var i = 0; i < userRoute.length; i++) {
            var point = userRoute[i].Location.split(',')
            coordinates.push([Number(point[0]), Number(point[1])])
        }
        console.log(coordinates)
        indexMap.drawOribitRoute(coordinates)

    }
}

// 根据人员位置列表绘制人员运动轨迹
function drawAnmateByOribt(userRoute) {
    var position = userRoute[0].Location.split(',');
    $(".map-member-img").eq(1).css({opacity: 1})
    indexMap.addOverLayer({
        dom: '#map-orbit',
        position: [[Number(position[0]), Number(position[1])]],
        offset: [0, -23.5],
        // isCenter: true,
        name: 'oribtlay',
        centerPosition: [Number(position[0]), Number(position[1])]
    })
    addMemberAnimate(userRoute)
}

// 执行人员跳动
function addMemberAnimate(userRoute) {
    var index = 1
    setInterval(function() {
        var location = userRoute[index].Location.split(',');
        indexMap['oribtlay']['0'].setPosition([location[0], location[1]]);
        index++;
        if(index >= userRoute.length) index = 0;
    }, 1000)
}

// function slideMemberAnimate() {
//     console.log(indexMap)
//     var features = indexMap['lineOrbitSource'].getFeatures()[0];
//     // moveFeature(features)
//     indexMap.map.on('postcompose', features)
// }
//
// function moveFeature(event) {
//     var geometry = features.getGeometry();
//     var length = geometry.getLength();
//     var stpes=5;
//     var geo_steps=stpes * res;
//     var arrowsNum=Math.floor(length/geo_steps);
//     for(var i = 0; i< arrowsNum; i++) {
//         var arraw_coor = geometry.getCoordinateAt( i * 1.0 / arrowsNum );
//         console.log(arraw_coor)
//     }
//     var vectorContext = event.vectorContext;
//     var frameState = event.frameState;
// }

// 用于测试
function onOpenTaskInfo() {
  // 需传参数  type-0  表示进行中任务
  api.openWin({
      name: 'homeTaskInfo',
      url: './homeTaskInfo.html',
      pageParam: {
          type: '0'
      }
  });

}

function onBack() {
  api.closeWin({});
}

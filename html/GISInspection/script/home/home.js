// 工单及任务总列表   工单列表    任务列表
var taskOrderList = [],
    orderList = [],
    taskList = [],
    resultIndex = 0;
var indexMap = {},
    memberStatus = 0;
apiready = function() {
    api.parseTapmode();
    //  initTaskListEvent();
    // 初始化地图
    indexMap = new Map({
        mapid: 'maphome'
    });
    // getLastTimeLocation();  // 获取人员上一次的位置轨迹 (zxf 20201028)
    indexMap.initArea();
    indexMap.initDeviceLayer(); //初始化管点管线图层
    indexMap.initLineOrbit(); //初始化人员轨迹图层
    // 实现沉浸式状态栏效果
    var header = $api.byId('header');
    $api.fixStatusBar(header);

    // 初始化员工在线、离线状态
    memberStatus = $api.getStorage('isOnline');
    console.log(memberStatus);
    memberStatus = memberStatus ? memberStatus : 0;
    $(".member-status").addClass(memberStatus ? 'on' : '');
    // 获取当前用户的位置 并向地图中添加
    setCurrentMapLocation();
    // 缩放地图事件
    $(".map-scale-btn").on('click', function() {
        if ($(this).hasClass('up')) {
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
    // getHomeTaskList();
    // getHomeOrderList();
    // drawAreaList()
    initTaskListAndOrderList(); //获取当前用户正在进行的任务和工单

}

/**
 * @method setCurrentMapLocation 设置当前员工在地图上
 */
function setCurrentMapLocation() {
    getMemberLocation(function(location) {
        var location = [106.54258025120019, 29.561620073599133];
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
        })
    });
}

/**
 * @method getHomeTaskList 请求接口改变员工离线、在线状态
 */
function setOnlineStatus(status) {
  var userInfo = $api.getStorage('userLoginInformation');
  // console.log(JSON.stringify(userInfo.currentUserInfo.userInfo.userId));
  var param = {
    IsOnline: status ? false : true,
    userId: userInfo.currentUserInfo.userInfo.userId
  }

  console.log(JSON.stringify(param));
    insertPersonStatus({
        data: {
            IsOnline: status ? false : true,
            userId: userInfo.currentUserInfo.userInfo.userId
        },
        success: function(ret) {
            memberStatus = status ? 0 : 1;
            $api.setStorage('isOnline', memberStatus);
            if (memberStatus) {
                $(".member-status").addClass('on');
            } else {
                $(".member-status").removeClass('on');
            }
            api.sendEvent({
                name: 'sendPersonLocation',
            });
        },
        fail: function(err) {
            console.log(JSON.stringify(err))
        }
    })
}

/**
 * @method getHomeTaskList 查询用户负责和参与的任务信息实体方法
 */
// function getHomeTaskList() {
//     getTaskInfoList({
//         success: function(ret) {
//             resultIndex++;
//             taskOrderList = taskOrderList.concat(ret.result);
//         },
//         fail: function(ret) {
//             resultIndex++;
//         }
//     });
// }

/**
 * @method getHomeOrderList 查询用户负责的工单实体方法
 */
// function getHomeOrderList() {
//     getOrderList({
//         success: function(ret) {
//             resultIndex++;
//             taskOrderList = taskOrderList.concat(ret.result);
//         },
//         fail: function(ret) {
//             resultIndex++;
//         }
//     });
// }

/**
 * @method drawAreaList 根据人员工单、任务的返回的区域在地图上绘制区域
 */
// function drawAreaList() {
//     resultIndex = 2;
//     taskOrderList = [{
//         areaId: '1',
//         areaName: '测试区域',
//         areaPoint: "104.15865182876587,30.02561330795288;104.14976835250854,30.021836757659912;104.15388822555542,30.018188953399658;104.15903806686401,30.018060207366943;104.15908098220825,30.020549297332764;104.15869474411011,30.02359628677368;104.15865182876587,30.02561330795288;"
//     }, {
//         areaId: '29',
//         areaName: '丰富的区域',
//         areaPoint: "104.15302991867065,30.023317337036136;104.14753675460815,30.019583702087406;104.15122747421265,30.01739501953125;104.1548752784729,30.017309188842773;104.15496110916138,30.01889705657959;104.15405988693237,30.0216007232666;104.15302991867065,30.023317337036136;"
//     }];
//     if (resultIndex >= 2 && taskOrderList.length > 0) {
//         indexMap.drawAreaSelect(taskOrderList);
//         indexMap.initMapClick(function(ret) {
//             console.log(ret.areaId);
//         });
//     }
// }

// // 根据人员位置列表会绘制人员轨迹
// function drawOrditOnMap(userRoute) {
//
//     for(var i = 0; i<userRoute.length; i++) {
//         var coordinates = [];
//         for( var i = 0; i < userRoute.length; i++) {
//             var point = userRoute[i].location.split(',')
//             coordinates.push([Number(point[0]), Number(point[1])])
//         }
//         alert(JSON.stringify(coordinates));
//         indexMap.drawOribitRoute(coordinates);
//
//     }
// }

// 根据人员位置列表绘制人员运动轨迹
// function drawAnmateByOribt(userRoute) {
//     var position = userRoute[0].location.split(',');
//     $(".map-member-img").eq(1).css({opacity: 1})
//     indexMap.addOverLayer({
//         dom: '#map-orbit',
//         position: [[Number(position[0]), Number(position[1])]],
//         offset: [0, -23.5],
//         // isCenter: true,
//         name: 'oribtlay',
//         centerPosition: [Number(position[0]), Number(position[1])]
//     })
//     addMemberAnimate(userRoute)
// }
//
// // 执行人员跳动
// function addMemberAnimate(userRoute) {
//     var index = 1
//     setInterval(function() {
//         var location = userRoute[index].Location.split(',');
//         indexMap['oribtlay']['0'].setPosition([location[0], location[1]]);
//         index++;
//         if(index >= userRoute.length) index = 0;
//     }, 1000)
// }

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

// 返回云平台首页
function toHome() {
  api.closeWin();
  api.closeFrame({
    name: 'group1'
  });
    // api.closeWin({
    //   name:'inspectionMain'
    // });
    // alert('点击了X');
    //
    // setTimeout(function() {
    //   api.closeWin({});
    // }, 500)
    //
    // api.closeFrameGroup({
    //     name: 'group1'
    // });


    // api.closeToWin({
    //   name: 'main'
    // })

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

// 新增区域 （zxf 20201028）
function onAddArea() {
    // api.openWin({
    //     name: 'addArea',
    //     url: '../../html/Area/addArea.html',
    // });
    api.openWin({
        name: 'areaLayer',
        url: '../Area/areaLayer.html',
        pageParam: {
            name: 'test'
        }
    });
}

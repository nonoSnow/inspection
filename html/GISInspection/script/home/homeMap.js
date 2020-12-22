var userLoginInformation = $api.getStorage('userLoginInformation');
// 获取人员上一次的位置轨迹 (zxf 20201028)
function getLastTimeLocation() {
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId,
        oneDay: ""
    };
    var options = {
        url: requestUrl + 'PersonService/GetLastTimeLocation',
        type: "post",
        data: data,
        success: function(ret) {
            if (ret.success) {
                var result = ret.result;
                drawOrditOnMap(result);
                drawAnmateByOribt(result);
            }
        },
        complete: function() {

        },
        error: function(err) {

        },

    }
    ajaxMethod(options);
}

function coordinateArrangement(result) { //整理坐标 (zxf 20201028)
    var coordinates = [];
    coordinates = result.filter(function(item) {
        var point = item.location.split('，');
        if (point.length > 1) {
            return item;
        }
    }).map(function(item) {
        var point = item.location.split('，');
        return [point[0], point[1]];
    });
    return coordinates;
}

// 根据人员位置列表会绘制人员轨迹 (zxf 20201028)
function drawOrditOnMap(result) {
    var coordinates = coordinateArrangement(result);
    indexMap.drawOribitRoute(coordinates);
}
// 根据人员位置列表绘制人员运动轨迹
function drawAnmateByOribt(result) {
    var coordinates = coordinateArrangement(result);
    var position = coordinates[0];
    $(".map-member-img").eq(1).css({
        opacity: 1
    })
    indexMap.addOverLayer({
        dom: '#map-orbit',
        position: [
            [Number(position[0]), Number(position[1])]
        ],
        offset: [0, -23.5],
        // isCenter: true,
        name: 'oribtlay',
        centerPosition: [Number(position[0]), Number(position[1])]
    })
    addMemberAnimate(coordinates)
}
// 执行人员跳动 (zxf 20201028)
function addMemberAnimate(coordinates) {
    var index = 1
    setInterval(function() {
        var location = coordinates[index];
        indexMap['oribtlay']['0'].setPosition([location[0], location[1]]);
        index++;
        if (index >= coordinates.length) index = 0;
    }, 1000)
}
//多个ajax异步请求的loading处理，arr数组需要传入延迟对象 (zxf 20201028)
function initTaskListAndOrderList() {
    var ajaxArr = [
        getHomeTaskList(),
        getHomeOrderList()
    ]
    // console.log($.when);
    $.when.apply($, ajaxArr)
        .then(
            function(res1, res2) {
              // console.log(JSON.stringify(res1));
              // console.log(JSON.stringify(res2));
                if (res1.success && res2.success) {
                  // console.log('111111111111');
                    taskOrderList = taskOrderList.concat(result = res1.result.map(function(item) {
                        item.type = 'task';
                        return item;
                    }));
                    taskOrderList = taskOrderList.concat(result = res2.result.map(function(item) {
                        item.type = 'order';
                        return item;
                    }));
                    drawAreaList();
                } else {
                    //  其中一个返回错误
                    //  alert("error");
                }

            },
            function() {
              // console.log('error');
                //  alert("error");
            }
        );
}

//getHomeTaskList 查询用户负责和参与的任务信息实体方法 (zxf 20201028)
function getHomeTaskList() {
    var def = $.Deferred();
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId,
    }
    var options = {
        url: requestUrl + 'PersonService/AppGetTasklistsByUserId',
        type: "post",
        data: data,
        success: function(ret) {
          // console.log(JSON.stringify(ret));
            if (ret.success) {}
        },
        complete: function(ret) {
            def.resolve(ret);
        },
        error: function(err) {},

    }
    ajaxMethod(options);
    return def;
}
//getHomeTaskList 查询用户负责和参与的任务信息实体方法 (zxf 20201028)
function getHomeOrderList() {
    var def = $.Deferred();
    // console.log(userLoginInformation.currentUserInfo.userInfo.userId);
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId,
    }
    var options = {
        url: requestUrl + 'PersonService/AppGetWorkOrderByUserId',
        type: "post",
        data: data,
        success: function(ret) {
          // console.log(JSON.stringify(ret));
            if (ret.success) {

            }
        },
        complete: function(ret) {
            def.resolve(ret);
        },
        error: function(err) {},

    }
    ajaxMethod(options);
    return def;
}

//  drawAreaList 根据人员工单、任务的返回的区域在地图上绘制区域 (zxf 20201028)
function drawAreaList() {
   //  //  接口返回数据不对，先使用测试数据
   //  resultIndex = 2;
   //  taskOrderList = [{
   //      type: 'order', //用于区分是任务还是工单 (zxf 20201030）
   //      areaId: '1',
   //      areaName: '测试区域',
   //      areaPoint: "104.15865182876587,30.02561330795288;104.14976835250854,30.021836757659912;104.15388822555542,30.018188953399658;104.15903806686401,30.018060207366943;104.15908098220825,30.020549297332764;104.15869474411011,30.02359628677368;104.15865182876587,30.02561330795288;"
   //  }, {
   //      type: 'task', //用于区分是任务还是工单 （zxf 20201030）
   //      areaId: '29',
   //      areaName: '丰富的区域',
   //      areaPoint: "104.15302991867065,30.023317337036136;104.14753675460815,30.019583702087406;104.15122747421265,30.01739501953125;104.1548752784729,30.017309188842773;104.15496110916138,30.01889705657959;104.15405988693237,30.0216007232666;104.15302991867065,30.023317337036136;"
   //  }];
   //  if (resultIndex >= 2 && taskOrderList.length > 0) {
  //  console.log(JSON.stringify(taskOrderList));
   if (taskOrderList.length > 0) {
        indexMap.drawAreaSelect(taskOrderList);
        indexMap.initMapClick(function(ret) {
          // console.log(JSON.stringify(ret));
          if(ret == null){
            $(".home-device img").attr('src','../../image/equipment.png');
            $('.homePage_order_list_box').remove();
            $(".home-device").off();
            return false;
          }
            var areaId = ret.areaId;
            var areaType = ret.type; //区域的类型，task 我任务。order为工单  zxf 20201030
            AppGetTaskAndWorkOrderByAreaIdAndUserId(areaId);
            initequipmentBtns(areaId, areaType);
        });
    }
}
// 根据区域ID和用户ID获取当前区域的人员负责或参与的任务和工单
function AppGetTaskAndWorkOrderByAreaIdAndUserId(areaId, areaType) {
    if (areaId == null && areaId == '') return false;
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId,
        areaId: areaId
    }
    var options = {
        url: requestUrl + 'AreaService/AppGetTaskAndWorkOrderByAreaIdAndUserId',
        type: "post",
        data: data,
        success: function(ret) {
            if (ret.success) {
                renderOrderOrworkTemplate(ret);
            }
        },
        error: function(err) {

        },

    }
    ajaxMethod(options);
}

function initequipmentBtns(areaId, areaType) {
    $(".home-device").off();
    if (areaId == null && areaId == ''){
       $(".home-device img").attr('src','../../image/equipment.png');
       return false;
    }
    $(".home-device img").attr('src','../../image/equipment_select.png');
    $(".home-device").on('click', function() {
        var data = {
            areaId: areaId,
            taskOrWork: areaType == 'task' ? 1 : 0,
            userId: userLoginInformation.currentUserInfo.userInfo.userId
        }
        var options = {
            url: requestUrl + 'AreaService/AppGetAreaAndTaskOrWorkOrder',
            type: "post",
            data: data,
            success: function(ret) {
                if (ret.success) {
                    indexMap.getCommonEle({
                        areaPoint: ret.result.areaPoint,
                        pointList: ret.result.deviceLists,
                        lineList: ret.result.pipelineLists,
                        areaType: areaType,
                        taskId: ret.result.taskId
                    }, null, function(ret) {
                      if(ret==null){
                          return false;
                      }
                        var paramers = {
                            deviceCode: ret.deviceCode,
                            deviceName: ret.deviceName,
                            devicePoint: ret.devicePoint,
                            address: ret.address,
                            deviceLoaction: ret.deviceLoaction,
                            id: ret.id,
                            typeStr: ret.typeStr,
                            status: ret.status,
                            statusStr: ret.statusStr,
                            type: ret.type,
                            areaType: ret.areaType,
                            taskId: ret.taskId,
                            workOrderId: ret.workOrderId,
                            workOrderStatus: ret.workOrderStatus,
                            workOrderType: ret.workOrderType,
                            workOrderTypeStr: ret.workOrderTypeStr,
                        };
                        if (ret.areaType == 'task') { //任务
                            api.openWin({
                                name: 'equipmentMapInfo',
                                url: '../../html/Home/equipmentMapInfo.html',
                                pageParam: {
                                    data: paramers,
                                    taskId:paramers.taskId,
                                    taskType: 0
                                }
                            });
                        } else { //工单
                            api.openWin({
                                name: 'jobDetail',
                                url: '../../html/Job/jobDetail.html',
                                pageParam: {
                                    type: 0,
                                    Id: paramers.workOrderId,
                                    type7: paramers.workOrderType
                                }
                            });
                        }

                    })
                }
            },
            error: function(err) {

            },

        }
        ajaxMethod(options);

    })
}

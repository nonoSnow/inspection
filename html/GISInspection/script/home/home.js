
// 工单及任务总列表   工单列表    任务列表
var taskOrderList = [], orderList = [], taskList = [], resultIndex = 0;
var indexMap = {}, memberStatus = 0;
apiready = function() {

    // 实现沉浸式状态栏效果
    var header = $api.byId('header');
    $api.fixStatusBar(header);

    // 获取当前用户的位置
    var gps = api.require('gps');
    gps.getGpsState(function(ret){
        alert(JSON.stringify(ret));
    });

    // 获取当前用户的位置及在线信息
    // getUserLoactionInfo();

    //获取当前用户正在进行的
    getHomeTaskList();
}

$(function() {
    // 初始化员工状态
    memberStatus = $api.getStorage('isOnline');
    memberStatus = memberStatus ? memberStatus : 0;
    $(".member-status").addClass(memberStatus ? 'on' : '');

    // 绘制地图
    indexMap = new Map({
        mapid: 'maphome'
    });

    indexMap.initArea();

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



})


/**
* @method getHomeTaskList 请求接口改变员工离线、在线状态
*/
function setOnlineStatus(status) {
    insertPersonStatus({
        data: {
            IsOnline: status ? false : true
        },
        success: function(ret) {
            console.log(JSON.stringify(ret))
            memberStatus = status ? 0 : 1;
            $api.setStorage('isOnline', memberStatus);
            if(memberStatus) {
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
    if(resultIndex >= 2 && taskOrderList.length > 0 ) {
        console.log(JSON.stringify(taskOrderList))
    }
}

// // 获取当前用户的位置及在线信息
// function getUserLoactionInfo () {
//     var userLoginInformation = $api.getStorage('userLoginInformation');
//     ajaxMethod({
//         url: apiUrl + 'PersonService/GetAllLocationPageList',
//         data: {
//             OneDay: '',
//             UserName: userLoginInformation.currentUserInfo.userInfo.trueName,
//             maxResultCount: 10,
//             pageIndex: 1
//         },
//         success: function(result) {
//             console.log(JSON.stringify(result))
//         },
//         error: function(err) {
//             JSON.stringify(err)
//         }
//     })
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

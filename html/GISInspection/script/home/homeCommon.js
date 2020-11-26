function renderOrderOrworkTemplate(ret) {
    var taskLists = ret.result.taskLists.map(function(item) {
        item.beginTime = item.beginTime != undefined ? item.beginTime : item.planStartTime != undefined ? item.planStartTime : null;
        item.planComplateTime = item.planComplateTime != undefined ? item.planComplateTime : item.planEndTime != undefined ? item.planEndTime : null;
        if (item.beginTime != '' && item.beginTime != null && item.beginTime != undefined) {
            item.beginTime = moment(item.beginTime).format('YYYY-MM-DD HH:mm');
        }
        if (item.planComplateTime != '' && item.planComplateTime != null && item.planComplateTime != undefined) {
            item.planComplateTime = moment(item.planComplateTime).format('YYYY-MM-DD HH:mm');
        }
        return item;
    });
    var workOrderLists = ret.result.workOrderLists.map(function(item) {
        item.planComplateTime = item.planComplateTime != undefined ? item.planComplateTime : item.planEndTime != undefined ? item.planEndTime : null;
        if (item.planComplateTime != '' && item.planComplateTime != null && item.planComplateTime != undefined) {
            item.planComplateTime = moment(item.planComplateTime).format('YYYY-MM-DD HH:mm');
        }
        return item;
    });
    var data = {
        taskLists: taskLists,
        workOrderLists: workOrderLists
    };
    var str = template('orderAndTaskListTemplate', data);
    if ($('body .homePage_order_list_box').length > 0) {
        $('body .homePage_order_list_box').remove();
    }
    $('body').append(str);
    initTaskListEvent();
}



// 首页区域显示任务列表
function initTaskListEvent() {
    $('.homePage_order_title').on('click', function() {
        if ($(this).parent().hasClass('active')) {
            if ($(this).siblings('.homePage_order_narrow').length != 0) {
                $(this).siblings('.homePage_order_narrow').removeClass('homePage_order_narrow').addClass('homePage_order_upper');
            }
            $(this).siblings('.homePage_order_upper').removeClass('active');
            $(this).parent().removeClass('active one');
        } else {
            if ($(this).siblings('.homePage_order_narrow').length != 0) {
                $(this).siblings('.homePage_order_narrow').removeClass('homePage_order_narrow').addClass('homePage_order_upper active');
            }
            $(this).siblings('.homePage_order_upper').addClass('active');
            $(this).parent().addClass('active');
        }
    });
    $('.homePage_order_body_content').on('click', function() {
      console.log('11111111111111111');
        var type = $(this).attr('type');
        var paramers = $(this).attr('parse');
        paramers = JSON.parse(paramers);
        console.log(JSON.stringify(paramers));
        if (type == 'task') {
            api.openWin({
                name: 'homeTaskInfo',
                url: '../../html/Home/homeTaskInfo.html',
                pageParam: {
                    type: 0,
                    id: paramers.taskId
                }
            });
        } else {
            api.openWin({
                name: 'jobDetail',
                url: '../../html/Job/jobDetail.html',
                pageParam: {
                    type: 0,
                    Id: paramers.workOrderId,
                    type7: paramers.type!=undefined?paramers.type:paramers.workType
                }
            });
        }

    });
}
// 上报事件
function onOpenReport() {
    api.openWin({
        name: 'addMethodReport',
        url: '../../html/Method/addMethodReport.html',
    });
}

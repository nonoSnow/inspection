
/**
* @method {Function} insertPerson 获取用户负责和参与的任务信息
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
*/
function insertPersonStatus(options) {
    // var userLoginInformation= $api.getStorage('userLoginInformation');
    // var data = {
    //     userId: userLoginInformation.currentUserInfo.userInfo.userId
    // }
    var data = options.data;
    var options = Object.assign({}, options, {
        url: requestUrl + 'PersonService/InsertPerson',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    })
    ajaxMethod(options);
}

/**
* @method {Function} getTaskInfoList 获取用户负责和参与的任务信息
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
*/

function getTaskInfoList(options) {
    var userLoginInformation= $api.getStorage('userLoginInformation');
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId
    }
    var options = Object.assign({}, options, {
        url: requestUrl + 'PersonService/AppGetTasklistsByUserId',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    })
    ajaxMethod(options);
}

/**
* @method {Function} getOrderList 根据用户ID获取用户负责的工单
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
*/

function getOrderList(options) {
    var userLoginInformation= $api.getStorage('userLoginInformation');
    var data = {
        userId: userLoginInformation.currentUserInfo.userInfo.userId
    }
    options = Object.assign({}, options, {
        url: requestUrl + 'PersonService/AppGetWorkOrderByUserId',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    })
    ajaxMethod(options);
}


function getDeviceList(options) {
    // var userLoginInformation= $api.getStorage('userLoginInformation');
    // var data = {
    //     userId: userLoginInformation.currentUserInfo.userInfo.userId
    // }
    var data = options.data;
    var options = Object.assign({}, options, {
        url: gisUrl + 'SearchPipe/SearchByExtent',
        data: {
            body: JSON.stringify(data)
        },
        error: function(err) {
            console.log(JSON.stringify(err))
            if(options.fail) options.fail(err);
        }
    })
    ajaxMethod(options);
}

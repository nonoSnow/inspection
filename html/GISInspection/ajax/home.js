
/**
* @method {Function} getTaskInfoList 获取用户负责和参与的任务信息
* @param {options} 请求需要的参数及回调函数
* data 请求需要的数据
*/
function getTaskInfoList(options) {
    options = Object.assignNew({}, options, {
        url: apiUrl + 'PersonService/AppGetTasklistsByUserId'
    })
    ajaxMethod(options);
}

/**
* @method  封装请求的方法
* @param {Object} options 请求需要的参数
* url 请求的地址
* data 请求传的参数 以对象形式传入
* files 上传文件 单文件类型为{"file": "path"}, 多文件为 {"file":["path1","path2"]}
* values {Object} 以表单方式提交参数 上传文件的时候有额外参数传入value中
* headers 头文件信息
* success 成功回调函数
* error 失败回调函数
*/
function ajaxMethod(options) {
    if(!options.url) return false;
    var data = {}, url = options.url, headers = options.headers || {};
    var userinfo = $api.getStorage('userLoginInformation')
    // headers['Authorization'] = 'Bearer ' +  userinfo.loginSuccessData.accessToken
    headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEwMjk0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6Ik5KTFMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsi5rqn5rC05pm65oWn5rC05Yqh566h55CG5ZGY6KeS6ImyIiwi6K6_5a6i54K5566h55CG6KeS6ImyIl0sImh0dHA6Ly93d3cuYXNwbmV0Ym9pbGVycGxhdGUuY29tL2lkZW50aXR5L2NsYWltcy90ZW5hbnRJZCI6IjEwMTU5IiwiVXNlck5hbWUiOiJOSkxTIiwiT3JnSWQiOiIxMDI5NCIsIlRydWVOYW1lIjoi5rqn5rC05pm65oWn5rC05Yqh566h55CG5ZGY55So5oi3IiwiQXZhdGVyIjoiIiwiT3JnTmFtZSI6Iua6p-awtOaZuuaFp-awtOWKoSIsIlRlbmFudE5hbWUiOiLmuqfmsLTmmbrmhafmsLTliqEiLCJUZW5hbnRDb25uZWN0U3RyaW5nIjoiIiwiUm9sZXMiOiIxNjMxODIsMTYzMTg0Iiwic3ViIjoiMTAyOTQiLCJqdGkiOiJlMWFlNWRkNC03NWNiLTRjNmItOTdkMy0zNmM3OGVmN2E3NzUiLCJpYXQiOjE2MDIwNTg5MTEsIm5iZiI6MTYwMjA1ODkxMSwiZXhwIjoxNjAyMTAyMTExLCJpc3MiOiJTbnRTb2Z0IiwiYXVkIjoiU250U29mdCJ9.vU43B0NXUjA1zTCunj-10XNCfwXdy3LcCnkWd84JqiQ'
    if(!options.type || options.type !='get') {
        // 上传data数据与上传文件不能同时存在
        if(options.files || options.values) {
            data.files = options.files || {};
            data.values = options.values || {};
        } else if (options.stream) {
            data.stream = options.stream;
        } else {
            // var jsonData = options.data || {};
            data.body = JSON.stringify(options.data || {});
            // data.body = options.data || {}
            headers['Content-Type'] = 'application/json';
        }
    } else {
        // 当请求类型为get是 将参数以&形式连接到请求地址后面
        var urlStr = connectRequestData(options.data);
        if(urlStr)
            url += '?' + connectRequestData(options.data);
    }
    api.ajax({
        url: url,
        method: options.type || 'post',
        timeout: options.timeout || 10,
        dataType: 'json',
        headers: headers,
        data: data
    }, function (ret, err) {
        if(ret) {
            if(options.success) options.success(ret);
        } else {
            if(options.error) options.error(err);
        }
    });
}

/**
* @method {Function} connectRequestData 将请求的参数以&的形式连接起来
* @param {Object} data 请求的数据
*/
function connectRequestData (data) {
    if(!data) return '';
    if($api.jsonToStr(data) == "{}") return '';

    var dataStr = ''
    for(var key in data) {
        dataStr += key + '=' + data[key] + '&'
    }

    return dataStr.substring(0, dataStr.length - 1);
}

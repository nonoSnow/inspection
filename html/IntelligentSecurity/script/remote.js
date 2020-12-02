var app = {
    apipath: 'http://' + $api.getStorage('apiUrl')+'/api/'
};

function fnPost(Path, data, contentType, isLogin, isPut, callback, files = "null", isErr = false) {
    var headers = {};

    if (files == "null") {
        var body = {
            body: data
        };
    } else {
          var body = {
            values: data,
            files: files
          }
    }

    if (contentType) {
        headers["Content-Type"] = contentType
    }

    if (isLogin) {
        if (!$api.getStorage('loginInfo')) {
            setTimeout(function() {
                api.closeToWin({
                    name: 'login'
                });
            }, 200);
            return;
        }
        headers.Authorization = $api.getStorage('loginInfo');
    }
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    console.log(1);
    console.log(JSON.stringify({
        url: app.apipath + Path,
        method: isPut ? 'put' : 'post',
        timeout: 30,
        dataType: 'json',
        returnAll: false,
        headers: files == 'null'?headers:{},
        data: body
    }));

    api.ajax({
        url: app.apipath + Path,
        method: isPut ? 'put' : 'post',
        timeout: 30,
        dataType: 'json',
        returnAll: false,
        headers: files == 'null'?headers:{},
        data: body
    }, function(ret, err) {
        callback(ret, err);
        if (err) {
            if (isErr) {
                callback(false, err);
            }
            callback(ret, err);
            if (err.body) {
                if (err.body.error) {
                    if (err.body.error.message == '10000') {
                        api.toast({
                            msg: err.body.error.details,
                            duration: 2000,
                            location: 'top'
                        });
                    } else {
                        api.toast({
                            msg: err.body.error.message,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                    if (err.body.error.message == '当前用户没有登录到系统！') {
                        setTimeout(function() {
                            api.closeToWin({
                                name: 'login'
                            });
                        }, 200);
                    }
                } else {
                    if (isErr == false) {
                        api.toast({
                            msg: err.body,
                            duration: 2000,
                            location: 'top'
                        });
                    }
                }
            } else {
                if (isErr == false) {
                    api.toast({
                        msg: err.msg,
                        duration: 2000,
                        location: 'top'
                    });
                }

            }
        }
    });
};

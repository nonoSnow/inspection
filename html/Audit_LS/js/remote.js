var app = {
    apipath: `${$api.getStorage("jhapipath")}waterMeters/info`,
    claimpath: 'http://' + $api.getStorage('apiUrl')+'/api/',
};
var now = Date.now();

function fnPost(Methods, data, contentType, isLogin, isPut, callback, files = "null", isErr = false) {
    var headers = {};

    if (files == "null") {
        var body = {
            body: JSON.stringify({
                Method: Methods,
                UserName: $api.getStorage("jhUserName"),
                Password: $api.getStorage("jhPassWord"),
                SerialNo: '',
                KeyCode: '', //营业
                Parameter: JSON.stringify(data)
            })
        };
    } else {
          var body = {
            values:{
              "Method": Methods,
              "UserName": $api.getStorage("jhUserName"),
              "Password": $api.getStorage("jhPassWord"),
              "SerialNo": '',
              "KeyCode": '', //营业
              "Parameter": JSON.stringify(data)
            },
            files:files
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
        headers.Authorization = $api.getStorage("jhHeaders");
    }
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });

    api.ajax({
        url: app.apipath,
        method: isPut ? 'put' : 'post',
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

function claimFnPost(path, data, contentType, isLogin, isPut, callback,isErr=false) {
    var headers = {};

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
        text:'',
        modal: false
    });

    app.claimpath += path;

    api.ajax({
        url: app.apipath,
        method: isPut ? 'put' : 'post',
        timeout: 15,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
        callback(ret, err);
        if (err) {
          if(isErr){
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
                  if(isErr == false){
                    api.toast({
                        msg: err.body,
                        duration: 2000,
                        location: 'top'
                    });
                  }
                }
            } else {
              if(isErr == false){
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

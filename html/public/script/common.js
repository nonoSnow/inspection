var apiUrl = 'http://' + $api.getStorage('apiUrl');
// var apiUrl = 'http://192.168.0.93:8002';
// var apiUrl = 'http://192.168.0.43:8889';
//字符串替换所有匹配字段
String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

/**
 * 日期转字符串
 * @param fmt
 * @returns
 */
Date.prototype.Format = function(fmt) {   
    var o = {       
        "M+": this.getMonth() + 1, //月份
               "d+": this.getDate(), //日
               "h+": this.getHours(), //小时
               "m+": this.getMinutes(), //分
               "s+": this.getSeconds(), //秒
               "q+": Math.floor((this.getMonth() + 3) / 3), //季度
               "S": this.getMilliseconds() //毫秒
               
    };   
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));   
    }
    for (var k in o) {      
        if (new RegExp("(" + k + ")").test(fmt)) {         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));      
        }   
    }   
    return fmt;
}

/**
 * 合并对象重写
 * @param 任意
 * @return 对象
 */
// Object.prototype.assignNew = function() {
//     var obj = arguments[0]
//     console.log(JSON.stringify(arguments))
//     for (var i = 1; i < arguments.length; i++) {
//         if($api.jsonToStr(arguments[i]) != "{}") {
//             for (var prop in arguments[i]) {
//                 console.log(prop)
//                 obj[prop] = arguments[i][prop]
//             }
//         }
//     }
//     return obj
// }

//获取时分秒
function getTime(data) {
    var str = data;
    var num = str.indexOf("T");
    if (num != -1) {
        str = str.substr(num + 1);
        return str;
    } else {
        return "";
    }
}

//判断是否为空
function isEmpty(mixed_var) {
    var key;
    if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

// 获取后端服务提供的公共参数
//     TenantId             租户ID，如果为null，则根据当前登录自动获取租户ID，为-1(这里假设ID都是从1开始的值)，则租户ID为null
//     OrgId                组织ID，如果为null，则根据当前登录自动获取组织ID
function getPublicParameter(TenantId, OrgId, ProductId, Code) {
    var result = null;
    var tenantId = TenantId;
    var orgId = OrgId;

    var loginInfo = $api.getStorage('UserLoginInfo');
    if (typeof loginInfo === 'object') {
        if (tenantId == null) tenantId = loginInfo.tenantInfo.tenantId;
        if (orgId == null) orgId = loginInfo.userInfo.orgId;
    }
    if (tenantId == -1) tenantId = null;

    var queryString = 'TenantId=' + tenantId + '&OrgId=' + orgId + '&ProductId=' + ProductId + '&Code=' + Code;
    var url = apiUrl + '/api/services/app/Authorization/GetPublicParameter?' + queryString;

    var obj = new XMLHttpRequest();
    obj.open('GET', url, false);
    obj.send(null);
    // alert('地址：' + url + '\r\n响应：' + obj.responseText);
    var ret = getResultfromXMLHttpRequest(obj);
    if (ret) result = ret.value;

    return result;
}

// 从XMLHttpRequest请求对象中返回结果，如果请求失败返回null
function getResultfromXMLHttpRequest(objXMLHttpRequest) {
    var result = null;
    var errCode = null;
    var errText = null;

    if (objXMLHttpRequest != null) {
        if (objXMLHttpRequest.readyState == 4 && objXMLHttpRequest.status == 200 || objXMLHttpRequest.status == 304) {
            var response = $api.strToJson(objXMLHttpRequest.responseText);
            if (response && response.success) {
                result = response.result;
            } else {
                errText = response.error;
            }
        } else {
            errCode = objXMLHttpRequest.status;
            errText = objXMLHttpRequest.statusText;
        }
    }

    if (errText) {
        api.toast({
            msg: '错误号：' + errCode + '\r\n描述：' + errText,
            duration: 5000,
            location: 'top'
        });
    }

    return result;
}

// 获取当前屏幕的方向，即是横屏还是竖屏显示
function getOrientation() {
    return (window.orientation == 90 || window.orientation == -90 ? 'landscape' : 'portrait');
}

// 设置屏幕横屏或竖屏显示
function setOrientation(orientation) {
    var curOrientation = getOrientation();
    if (orientation && orientation != curOrientation) {
        if (orientation == 'portrait') {
            api.setScreenOrientation({
                orientation: 'auto_portrait'
            });
        } else {
            api.setScreenOrientation({
                orientation: 'auto_landscape'
            });
        }
    }
}

//ios向右滑动时设置状态栏颜色
function setIOSBar() {
    api.addEventListener({
        name: 'viewdisappear'
    }, function(ret, err) {
        if (api.systemType == 'ios') {
            api.setStatusBarStyle({
                style: 'light',
            });
        }
    });
}

function changeFontSize() {
    var changeSize = $api.getStorage('fontSize');
    if (changeSize == undefined || changeSize == 'normal') {
        document.body.style.setProperty('--fontsize9', '0.9rem');
        document.body.style.setProperty('--fontsize85', '0.85rem');
        document.body.style.setProperty('--fontsize8', '0.8rem');
        document.body.style.setProperty('--fontsize75', '0.75rem');
        document.body.style.setProperty('--fontsize7', '0.7rem');
        document.body.style.setProperty('--fontsize65', '0.65rem');
        document.body.style.setProperty('--fontsize6', '0.6rem');
        document.body.style.setProperty('--fontsize55', '0.55rem');
        document.body.style.setProperty('--fontsize5', '0.5rem');
        document.body.style.setProperty('--fontsize45', '0.45rem');
        document.body.style.setProperty('--fontsize4', '0.4rem');
        document.body.style.setProperty('--width2', '2rem');
        document.body.style.setProperty('--width34', '3.4rem');
        document.body.style.setProperty('--width42', '4.2rem');
    } else if (changeSize == 'large') {
        document.body.style.setProperty('--fontsize9', '0.99rem');
        document.body.style.setProperty('--fontsize85', '0.935rem');
        document.body.style.setProperty('--fontsize8', '0.88rem');
        document.body.style.setProperty('--fontsize75', '0.825rem');
        document.body.style.setProperty('--fontsize7', '0.77rem');
        document.body.style.setProperty('--fontsize65', '0.715rem');
        document.body.style.setProperty('--fontsize6', '0.66rem');
        document.body.style.setProperty('--fontsize55', '0.605rem');
        document.body.style.setProperty('--fontsize5', '0.55rem');
        document.body.style.setProperty('--fontsize45', '0.495rem');
        document.body.style.setProperty('--fontsize4', '0.44rem');
        document.body.style.setProperty('--width2', '2.2rem');
        document.body.style.setProperty('--width34', '3.74rem');
        document.body.style.setProperty('--width42', '4.62rem');
    } else if (changeSize == 'small') {
        document.body.style.setProperty('--fontsize9', '0.81rem');
        document.body.style.setProperty('--fontsize85', '0.765rem');
        document.body.style.setProperty('--fontsize8', '0.72rem');
        document.body.style.setProperty('--fontsize75', '0.675rem');
        document.body.style.setProperty('--fontsize7', '0.63rem');
        document.body.style.setProperty('--fontsize65', '0.585rem');
        document.body.style.setProperty('--fontsize6', '0.54em');
        document.body.style.setProperty('--fontsize55', '0.495rem');
        document.body.style.setProperty('--fontsize5', '0.45rem');
        document.body.style.setProperty('--fontsize45', '0.405rem');
        document.body.style.setProperty('--fontsize4', '0.36rem');
        document.body.style.setProperty('--width2', '1.8rem');
        document.body.style.setProperty('--width34', '3.06rem');
        document.body.style.setProperty('--width42', '3.78rem');
    }
}

changeFontSize();

// zxf 模拟弹窗
function dialogAlert(params, callback) {
    let BtnNumbers = ''
    if (params.buttons.length != 0 || params.buttons != undefined) {
        var buttons = params.buttons;
        for (let i = 0; i < buttons.length; i++) {
            BtnNumbers += `<div class="dialogBtn" data-attr='${i+1}'>${buttons[i]}</div>`;
        }
    }
    if (BtnNumbers == '') {
        BtnNumbers = `  <div class="dialogBtn" data-attr='1'>确定</div>
             <div class="dialogBtn" data-attr='2'>取消</div>`;
    }
    let HtmlCentent = `<div class="dilogMark">
               <div class="dialogBox">
                   <div class="dialog_title"><span>${params.title!='' || params.title!=undefined  || params.title!= null ?params.title : '提示'}</span></div>
                   <div class="dialog_body"><span>${params.content !='' || params.content !=undefined ? params.content:'确定要操作吗'}</span></div>
                   <div class="dialog_footer">
                     ${BtnNumbers}
                   </div>
               </div>
           </div>`;

    // 在标签结束前添加html内容
    document.body.insertAdjacentHTML('beforeend', HtmlCentent);
    if (params.content.length > 15) {
        document.querySelector('.dialog_body').classList.add("lang_content");
    }

    // 为按钮添加单击事件
    checkDialogBtn(callback);
};

function checkDialogBtn(callback) {
    var dialogBtn = $('.dialogBtn');
    $(dialogBtn[dialogBtn.length - 1]).addClass('noneBorder');
    var isClose = false;
    for (let i = 0; i < dialogBtn.length; i++) {
        $(dialogBtn[i]).on('click', function() {
            $(this).addClass("active");
            var index = $(this).attr('data-attr');
            //  确定
            var data = {
                buttonIndex: index
            }
            callback(data);
            // 移除标签
            document.body.removeChild(document.querySelector('.dilogMark'));

            isClose = true;
        });
        if (isClose) {
            break;
        }
    }
}

// 下载插件包
function CheckAppVsersionByTeantId() {
    api.closeFrame({
        name: 'main'
    });
    var userLoginInformation = $api.getStorage('userLoginInformation');
    userLoginInformation.newVersionRemark=[];
    userLoginInformation.newVersionNumber=0;
    $api.setStorage('userLoginInformation',userLoginInformation);
  // console.log(JSON.stringify(userLoginInformation.versionInformation.length));
    // console.log(JSON.stringify(userLoginInformation.versionInformation));

    if (userLoginInformation.loginSuccessData != undefined) { //判断用户是否登录
        fnPost('services/app/AppVersionService/CheckAppVsersionByTeantId', {
            body: JSON.stringify({
                "tenantId": userLoginInformation.loginSuccessData.tenantId
            })
        }, 'application/json', true, false, (ret, err) => {
            if (ret && ret.success) {
                var callbackResult = ret.result;
                if (callbackResult.length != 0) {
                    if (userLoginInformation != undefined) {
                        if (userLoginInformation.versionInformation != undefined && userLoginInformation.versionInformation.length > 0) {
                            // 判断应用是否有新版本
                            checkNewVersion(callbackResult);
                        } else {
                          //  没有新的版本
                            var appList = userLoginInformation.appList[0].applications;
                            var versionInformation = [];
                            var appNumber = 0;

                            for (let i = 0; i < callbackResult.length; i++) {
                                if (callbackResult[i].moduleCode == 'WaterStarOne-Cloud-S9') {
                                    versionInformation.push(callbackResult[i]);
                                }
                                appNumber++;
                                for (let j = 0; j < appList.length; j++) {
                                    if (callbackResult[i].moduleCode === appList[j].coding) { //判断应用列表和版本返回的数据相同才可以显示和下载
                                        callbackResult[i].newVersionPackageUrl = '';
                                        callbackResult[i].newHasVersion = false;
                                        callbackResult[i].newVersionNo = '';
                                        versionInformation.push(callbackResult[i]);
                                    }
                                }
                            }
                            if (appNumber == callbackResult.length) {
                                userLoginInformation.versionInformation = versionInformation;
                                $api.setStorage('userLoginInformation', userLoginInformation);
                                downLoadZip(callbackResult);
                            }
                        }
                    }
                }

            } else {
                api.toast({
                    msg: '网络无法连接，请检查网络配置',
                    duration: 2000,
                    location: 'top'
                });

            }
        });
    }

}
// 检查应用是否有新版本
function checkNewVersion(newApplicationList) {
    var newApplicationList = newApplicationList;
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var oldApplicationList = userLoginInformation.versionInformation; //版本信息
    var appList = userLoginInformation.appList[0].applications;
    var number = 0;
    var hasNewVersion = 0;
    // 判断是否添加了新的应用
    if(appList.length!=oldApplicationList.length-1){
       var oldNumber =0;
      for (let v = 0; v < appList.length; v++) {
         for(let old =0; old<oldApplicationList.length;old++){
           if (appList[v].coding !== oldApplicationList[old].moduleCode) {
               oldNumber++;
           }
         }
       }
    //  if(oldNumber == oldApplicationList.length){
       if(oldNumber != 0){
           // 添加新的应用（查找文件，查勘文件是否存在。不存在。则默认下载解压）
           for (let v = 0; v < appList.length; v++) {
           for(let n=0;n<newApplicationList.length;n++){
             if(appList[v].coding == newApplicationList[n].moduleCode){
               for(var o =0;o<oldApplicationList.length;o++){
                   if(appList[v].coding != oldApplicationList[o].moduleCode){
                     newApplicationList[n].newVersionPackageUrl = '';
                     newApplicationList[n].newHasVersion = false;
                     newApplicationList[n].newVersionNo = '';
                     oldApplicationList.push(newApplicationList[n]); //缓存中添加新的应用信息
                     addNewApplication(newApplicationList[n]); //下载新的应用到本地  newApplicationList每次接口查询出来的结果
                     break;
                   }
               }
             }
           }
            }
     }
  //  }
 }

    for (let i = 0; i < newApplicationList.length; i++) {
        number++;
        var isNewData = 0;
        for (let j = 0; j < oldApplicationList.length; j++) {
          // 针对公告文件 不提示有新的版本，有新的版本，就直接更新
          if(newApplicationList[i].moduleCode == 'WaterStarOne-Cloud-S9' && oldApplicationList[j].moduleCode == 'WaterStarOne-Cloud-S9'){
            if (newApplicationList[i].versionNo != oldApplicationList[j].versionNo || newApplicationList[i].packetUrl !== oldApplicationList[j].packetUrl){
              addNewApplication(newApplicationList[i],true);
              newApplicationList[i].newVersionPackageUrl = newApplicationList[i].packetUrl;
              newApplicationList[i].newHasVersion = false;
              newApplicationList[i].newVersionNo = newApplicationList[i].versionNo;
              oldApplicationList[j] = newApplicationList[i];
            }

          }
            for(let vp = 0;vp<appList.length;vp++){
              // 已有的应用，判断是否有新版本
              if (newApplicationList[i].moduleCode == oldApplicationList[j].moduleCode && appList[vp].coding == newApplicationList[i].moduleCode ) {
                  if (newApplicationList[i].versionNo != oldApplicationList[j].versionNo || newApplicationList[i].packetUrl !== oldApplicationList[j].packetUrl) {
                      hasNewVersion++;
                      oldApplicationList[j].newVersionPackageUrl = newApplicationList[i].packetUrl;
                      oldApplicationList[j].newHasVersion = true;
                      oldApplicationList[j].newVersionNo = newApplicationList[i].versionNo;
                      continue;
                  } else {
                      // 版本没有更新，则切换里面的信息
                      // addNewApplication(newApplicationList[i]); //用于新加的应用，可能存在缓存中，用户判断是否下载到本地
                      newApplicationList[i].newVersionPackageUrl = ''
                      newApplicationList[i].newHasVersion = false;
                      newApplicationList[i].newVersionNo = ''
                      oldApplicationList[j] = newApplicationList[i];
                      continue;
                  }
              }
            }

        }
    }
    if (number == newApplicationList.length) {
        for (let i = 0; i < oldApplicationList.length; i++) {
            if (oldApplicationList[i].moduleCode == 'WaterStarOne-Cloud-S9') {
                if (oldApplicationList[i].newHasVersion) {
                    oldApplicationList[i].newHasVersion = false;
                    checkLocalFile(oldApplicationList[i]);
                    break;
                }
            }
        }
        userLoginInformation.versionInformation = oldApplicationList;
        // console.log(JSON.stringify(userLoginInformation.versionInformation));
        $api.setStorage('userLoginInformation', userLoginInformation);
    }
    if (hasNewVersion != 0) {
        // console.log(hasNewVersion)
        api.openFrame({
            name: 'updateVersion_frame',
            url: './updateVersion_frame.html',
            rect: {
                x: 0,
                y: 0,
                w: 'auto',
                h: 'auto'
            },
            bounces: false,
            pageParam:{
              type:'update'
            },
            bgColor: 'rgba(0,0,0,0.1)',
        });
    } else {
        IsDecompression();
    }

}


// 下载模块文件
var progressValue = 0;

function downLoadZip() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var versionInformation = userLoginInformation.versionInformation;
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块
    // 当前登录人员有应用列表
    if (versionInformation.length > 0) {
        // 进度条
        var UIActionProgress = api.require('UIActionProgress');
        UIActionProgress.open({
            maskBg: 'rgba(0,0,0,0.5)',
            styles: {
                h: 108,
                bg: '#fff',
                title: {
                    size: 13,
                    color: '#000',
                    marginT: 10
                },
                msg: {
                    size: 12,
                    color: '#000',
                    marginT: 5
                },
                lable: {
                    size: 12,
                    color: '#696969',
                    marginB: 5
                },
                progressBar: {
                    size: 2,
                    normal: '#000',
                    active: '#4876FF',
                    marginB: 35,
                    margin: 5
                }
            },
        }, function(ret) {
            // api.alert({
            //     msg: JSON.stringify(ret)
            // });
        });
        var numberNo = 0;
        for (let i = 0; i < versionInformation.length; i++) {
            (function(i) {
                numberNo++;
                var moduleName = versionInformation[i].moduleName.replace(/(^\s*)/g, "");
                var packetUrl = versionInformation[i].packetUrl.replace(/(^\s*)/g, "");
                // 判断文件是否存在
                fs.exist({
                    path: `fs://${moduleName}.zip`
                }, function(ret, err) {
                    if (ret.exist) {
                        // 文件存在,并且有新的版本，则更新
                        if (versionInformation[i].newHasVersion == true) {
                            var newpacketUrl = versionInformation[i].newVersionPackageUrl.replace(/(^\s*)/g, "");
                            var downloadUrl = apiUrl + newpacketUrl;
                            // 用于显示更新的内容
                            var localStorageInfo = $api.getStorage('userLoginInformation');
                            var newVersionRemark = localStorageInfo.newVersionRemark;
                            var num = 0;
                            if(newVersionRemark.length == 0){
                              localStorageInfo.newVersionRemark.push(versionInformation[i]);
                              localStorageInfo.newVersionNumber++;
                            }else {
                              for(let j=0;j<newVersionRemark.length;j++){
                                if(newVersionRemark[j].moduleCode !== versionInformation[i].moduleCode){
                                  localStorageInfo.newVersionRemark.push(versionInformation[i]);
                                  localStorageInfo.newVersionNumber++;
                                } else {
                                  newVersionRemark[j] = versionInformation[i];
                                }
                              }
                            }
                            $api.setStorage('userLoginInformation',localStorageInfo);

                            // 用于显示更新的内容结束

                            downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, versionInformation[i]);
                        }
                        UIActionProgress.close();
                    } else {
                        // 文件不存在，下载
                        if (packetUrl != '') {
                            var downloadUrl = apiUrl + packetUrl;
                            downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, versionInformation[i]);
                        }
                    }
                });
            })(i);
        }
        if (numberNo == versionInformation.length) {
            userLoginInformation.versionInformation = versionInformation;
            $api.setStorage('userLoginInformation', userLoginInformation);
        }
    } else {
        //     // 当前登录人员没有应用列表
    }
}


function downLoadZipToLocal(moduleName, downloadUrl, zip, UIActionProgress, singleVersionInformation) {
    api.download({
        url: downloadUrl,
        savePath: `fs://${moduleName}.zip`,
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            progressValue++;
            //下载成功
            zip.unarchive({
                file: `fs://${moduleName}.zip`,
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    var versionInformation = userLoginInformation.versionInformation;
                    for (let i = 0; i < versionInformation.length; i++) {
                        if (singleVersionInformation.moduleCode == versionInformation[i].moduleCode && singleVersionInformation.newHasVersion) {
                            singleVersionInformation.packetUrl = singleVersionInformation.newVersionPackageUrl;
                            singleVersionInformation.versionNo = singleVersionInformation.newVersionNo;
                            singleVersionInformation.newVersionPackageUrl = '';
                            singleVersionInformation.newHasVersion = false;
                            singleVersionInformation.newVersionNo = '';
                            versionInformation[i] = singleVersionInformation;
                            break;
                        }
                    }
                    // console.log(userLoginInformation.newVersionNumber);
                    // console.log(userLoginInformation.newVersionRemark.length);
                    userLoginInformation.versionInformation = versionInformation;
                    $api.setStorage('userLoginInformation', userLoginInformation);
                    if (versionInformation.length == progressValue) {
                        UIActionProgress.close();
                        api.toast({
                            msg: '更新成功!',
                            duration: 2000,
                            location: 'top'
                        });
                      //  更新成功信息

                    }
                    if( userLoginInformation.newVersionNumber == userLoginInformation.newVersionRemark.length){
                      api.openFrame({
                          name: 'updateVersion_frame',
                          url: './updateVersion_frame.html',
                          rect: {
                              x: 0,
                              y: 0,
                              w: 'auto',
                              h: 'auto'
                          },
                          bounces: false,
                          pageParam:{
                            type:'remark',
                            number:'all'
                          },
                          bgColor: 'rgba(0,0,0,0.1)',
                      });
                    }
                }
            });
        } else {
            UIActionProgress.setData({
                data: {
                    title: '正在为您下载更新资源包',
                    value: ret.percent
                }
            });

        }
    });
}

// 查询本地是否存在文件(不存在就提示（网络没有连接）)
function checkLocalFile(datas) {
    var fs = api.require('fs');
    var zip = api.require('zip');
    var downloadUrl = apiUrl + datas.packetUrl;
    api.download({
        url: downloadUrl,
        savePath: `fs://${datas.moduleName}.zip`,
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            //下载成功
            zip.unarchive({
                file: `fs://${datas.moduleName}.zip`,
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {}
            });
        }
    });
}
//判断文件是否已经解压
function IsDecompression() {
    var fs = api.require("fs");
    var zip = api.require("zip");
    var userLoginInformation = $api.getStorage('userLoginInformation');
    var versionInformation = userLoginInformation.versionInformation;
    // 判断文件是否存在
    fs.exist({
        path: `fs://wgt`
    }, function(ret, err) {
        if (ret.exist) {
            for (let i = 0; i < versionInformation.length; i++) {
                (function(i) {
                    var moduleName = versionInformation[i].moduleName.replace(/(^\s*)/g, "");
                    fs.exist({
                        path: `fs://${moduleName}.zip`
                    }, function(ret, err) {
                        if (ret.exist) {
                            zip.unarchive({
                                file: `fs://${moduleName}.zip`,
                                password: '',
                                toPath: 'fs://wgt/'
                            }, function(ret, err) {
                                if (ret.status) {}
                            });
                        }
                    });
                })(i);
            }

        }
    });




}

// 下载设置-关于版本中单个应用更新
function singleAppUpdate(datas, isParams, callback) {
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块

    // 进度条
    var UIActionProgress = api.require('UIActionProgress');
    UIActionProgress.open({
        maskBg: 'rgba(0,0,0,0.5)',
        styles: {
            h: 108,
            bg: '#fff',
            title: {
                size: 13,
                color: '#000',
                marginT: 10
            },
            msg: {
                size: 12,
                color: '#000',
                marginT: 5
            },
            lable: {
                size: 12,
                color: '#696969',
                marginB: 5
            },
            progressBar: {
                size: 2,
                normal: '#000',
                active: '#4876FF',
                marginB: 35,
                margin: 5
            }
        },
    }, function(ret) {
        // api.alert({
        //     msg: JSON.stringify(ret)
        // });
    });
    var moduleName = datas.moduleName.replace(/(^\s*)/g, "");

    if (isParams) {
        var packetUrl = datas.newVersionPackageUrl.replace(/(^\s*)/g, "");
    } else {
        var packetUrl = datas.packetUrl.replace(/(^\s*)/g, "");
    }

    api.download({
        url: apiUrl + packetUrl,
        savePath: `fs://${moduleName}.zip`,
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            //下载成功
            zip.unarchive({
                file: `fs://${moduleName}.zip`,
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    var versionInformation = userLoginInformation.versionInformation;
                    for (let i = 0; i < versionInformation.length; i++) {
                        if (versionInformation[i].moduleCode == datas.moduleCode) {
                            versionInformation[i].packetUrl = datas.newVersionPackageUrl;
                            versionInformation[i].versionNo = datas.newVersionNo;
                            versionInformation[i].newVersionPackageUrl = '';
                            versionInformation[i].newHasVersion = false;
                            versionInformation[i].newVersionNo = '';
                            break;
                        }
                    }
                    userLoginInformation.versionInformation = versionInformation;
                    $api.setStorage('userLoginInformation', userLoginInformation);
                    callback(true);
                    UIActionProgress.close();
                    api.toast({
                        msg: '版本更新成功!',
                        duration: 2000,
                        location: 'top'
                    });
                }
            });
        } else {
            UIActionProgress.setData({
                data: {
                    title: '正在为您下载更新资源包',
                    value: ret.percent
                }
            });
        }
    });
}

// 添加新的应用
function addNewApplication(datas,isPublic = false) { //isPublic 公告文件是否有更新
    var fs = api.require('fs'); //引用fs模块
    var zip = api.require('zip'); //引用zip模块
    var moduleName = datas.moduleName.replace(/(^\s*)/g, "");
    var packetUrl = datas.packetUrl.replace(/(^\s*)/g, "");
    var fileInfo = {
      moduleName:moduleName,
      packetUrl:packetUrl,
      zip:zip
    }
    fs.exist({
        path: `fs://${moduleName}.zip`
    }, function(ret, err) {
        if (ret.exist) {
          if(isPublic){
            downloadFile(fileInfo,true);
          }
        } else {
           downloadFile(fileInfo);
        }
    });

}

function downloadFile(fileInfo,IsExist = false){
  // IsExist 如果是已有的压缩包存在，则判断解压文件中是否存在，存在，则解压
  if(IsExist){
    fs.exist({
        path: `fs://wgt/${fileInfo.moduleName}`
    }, function(ret, err) {
        if (ret.exist) {

        } else {
          fileInfo.zip.unarchive({
              file: `fs://${fileInfo.moduleName}.zip`,
              password: '',
              toPath: 'fs://wgt/'
          }, function(ret, err) {
              if (ret.status) {}
          });
        }
    });


  }else {
    api.download({
        url: apiUrl + fileInfo.packetUrl,
        savePath: `fs://${fileInfo.moduleName}.zip`,
        report: true,
        cache: false,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            //下载成功
            fileInfo.zip.unarchive({
                file: `fs://${fileInfo.moduleName}.zip`,
                password: '',
                toPath: 'fs://wgt/'
            }, function(ret, err) {
                if (ret.status) {}
            });
        }
    });
  }
}


// 自动登录
function automaticLanding() {
    fnPost('services/app/PushInterface/ConnectionTest', {}, 'application/json', false, false, function(ret, err) {
        api.hideProgress();
        if (ret && ret.success && ret.result) {
            APPAuthenticate();
        }
    });
}

function APPAuthenticate() {
    var userLoginInformation = $api.getStorage('userLoginInformation');
    // app
    fnPost('TokenAuth/APPAuthenticate', {
        body: JSON.stringify(userLoginInformation.loginData)
    }, 'application/json', false, false, function(ret, err) {
        if (ret) {
            if (ret.success) {
                // 保存用户登录成功后所有信息 zxf 2019.12.9
                var Authorization = 'Bearer ' + ret.result.accessToken;
                $api.setStorage('loginInfo', Authorization);
                $api.setStorage('allTenants', ret.result.allTenants);
                $api.setStorage('tenantId', ret.result.tenantId);
                $api.setStorage('loginData', userLoginInformation.loginData);
                loginedData = $api.getStorage('loginUsers');
                var userData = {
                    account: userLoginInformation.loginData.userName,
                    password: userLoginInformation.loginData.password
                }
                var bindData = {
                    userId: ret.result.userId,
                    machineCode: $api.getStorage('registrationId') //手机唯一编码 index中
                }
                var recentUser = {
                    account: "",
                    password: ""
                };
                fnPost('services/app/User/UpdateMachineCode', {
                    body: JSON.stringify(bindData)
                }, 'application/json', true, true, function(ret, err) {})
                recentUser.account = userLoginInformation.loginData.userName;
                recentUser.password = userLoginInformation.loginData.password;
                $api.setStorage('recentUser', recentUser);
                if (loginedData == undefined) {
                    loginedData = [];
                }
                if (loginedData.length == 0) {
                    loginedData.push(userData);
                } else {
                    for (var i = 0; i < loginedData.length; i++) {
                        if (loginedData[i].account == userData.account) {
                            break
                        }
                        if (i == loginedData.length - 1) {
                            loginedData.push(userData);
                        }
                    }
                }
                $api.setStorage('loginUsers', loginedData);
            }
        } else {
            api.openWin({
                name: 'login',
                url: 'widget://html/login/login.html',
                slidBackEnabled: false,
                bgColor: 'widget://image/login/login_backgroud.png'
            });
        }
    }, true);
}

function getCurrentLocation() {
  var CurrentLocation = {
    lon:"",
    lat:"",
  }
    var bMap = api.require('bMap');
    bMap.getLocation({
        accuracy: '100m',
        autoStop: true,
        filter: 1
    }, function(ret, err) {
        if (ret.status) {
          CurrentLocation.lon=ret.lon;
          CurrentLocation.lat = ret.lat;
          $api.setStorage('CurrentLocation',CurrentLocation);
        }
    });
}

// 首页任务一键认领
function ConfirmTaskAll(type,data){
  // 一键领取所有任务
  var CurrentLocation =$api.getStorage('CurrentLocation');
  var body={
    body:JSON.stringify({
      lng:CurrentLocation.lon,
      lat: CurrentLocation.lat,
      account: $api.getStorage("jhUserName"),
      passWord: $api.getStorage("jhPassWord")
    })
  };
  fnPost('services/app/WorkFlow/ConfirmTaskAll',body,'application/json',true,false,function(ret,err){
    if(ret){
      if(ret.success){
        vant.Toast('任务认领成功');
        var url ='';
        if(type == "home"){
      //  $('.newTask').hide();
        }
         for(let i=0;i<data.length;i++){
          (function(i){
              openTaskDispose(data[i]);
          })(i);
         }
        api.openWin({
            name: 'MyTask',
            url: 'widget://html/Task/MyTask.html',
        });
      }
    }
  })
}

// 我的任务存放到本地
function openTaskDispose(item){
  console.log(JSON.stringify(item));
   var db = api.require("db");
  //  console.log(JSON.stringify(item));
  //  var SheetId = 0;
   db.selectSql({
     name:'Wsdatabase',
     sql:'select Id from myTaskSheet order by Id desc limit 1'
   },(ret,err)=>{
     if(ret.status){
       if(ret.data.length>0){
         SheetId= ret.data[0].Id;
       }
     }
   });
  //  查询数据库中是否有该数据
    // db.selectSql({
    //     name: 'Wsdatabase',
    //     sql:  `select * FROM myTaskSheet where taskCode=${item.taskCode}`
    // }, function(ret, err){
    //     if( ret.status ){
    //       if(ret.data.length==0){
    //         db.executeSql({
    //             name: 'Wsdatabase',
    //             sql: `Insert into myTaskSheet (Id,thirdTaskId,taskCode,creationTime,submitNum,statusFlag,statusFlagText,productId,productName,ClaimTime,productCode) values (${SheetId},${item.thirdTaskId},${item.taskCode},${item.creationTime},${item.submitNum},${item.statusFlag},${item.statusFlagText},${item.productId},${item.productName},${item.time},${item.productCode})`
    //         }, function(ret, err){
    //             if( ret.status ){
    //                 alert( JSON.stringify( ret ) );
    //             }else{
    //                 alert( JSON.stringify( err ) );
    //             }
    //         });
    //
    //       }
    //     }
    // });
  }
  function onCreateFS(){
     var fs = api.require('fs');
     // 判断文件夹是否存在，存在就打开数据库，不存在，就建立文件夹后在打开数据库（数据库打开，各个页面都可以操作，除非自己手动关闭）
     fs.exist({
         path: 'fs://Wsdatabase'
     }, (ret, err) => {
         if (ret.exist) {
             // 创建数据库（存在就打开，不存在就创建）
             openDatabase();
         } else {
             // 创建数据库文件
             fs.createDir({
                 path: 'fs://Wsdatabase'
             }, (ret, err) => {
                 if (ret.status) {
                     // 创建数据库（存在就打开，不存在就创建）
                     openDatabase();
                 } else {
                     console.log(JSON.stringify(err));
                 }
             });
         }
     });

 }
  function openDatabase(){
     // 打开数据库
     var db = api.require('db');
     db.openDatabase({
         name: 'Wsdatabase',
         path: 'fs://Wsdatabase/Wsdatabase.db'
     }, (ret, err) => {
         if (ret.status) {
             // console.log('数据库打开成功')
         } else {
             console.log(JSON.stringify(err));
         }
     });
 }

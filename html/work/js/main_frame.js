var vueInitData = {
    tenantName: "",
    allTenants: $api.getStorage('allTenants'),
    showTenantSelect: false,
    appView: $api.getStorage('isAppOrList') == undefined ? 'app' : $api.getStorage('isAppOrList'),
    appData: $api.getStorage('userLoginInformation') != undefined && $api.getStorage('userLoginInformation').appList != undefined ? $api.getStorage('userLoginInformation').appList : [],
    notices: [],
    isLoading: false,
    pieChartDom: null,
    taskCountSum: {
        waitNumber: 0,
        launchNumber: 0,
        handledNumber: 0
    },
    taskCountPie: [],
    // claimListData: [], //一键认领的数据
    userLoginInformation: $api.getStorage('userLoginInformation'), //存储组件化信息，应用列表信息，首页图表数据，zxf 2020-04-11
    claimContent: '认领列表', //任务认领显示问题
    showCbUpdateBtn: false, //是否显示抄表数据更新按钮 （有抄表管家应用才会显示）
    showClaimBtn:false, //是否显示一键认领
    showClearDataBtn:false,//是否显示清除数据按钮

}

function fnInVue() {
    window.MainVue = new Vue({
        el: "#wrap",
        data: vueInitData,
        methods: {
            openTenantSelect() { //多租户时点击名字旁的箭头可切换租户
                this.showTenantSelect = !this.showTenantSelect;
                if (this.showTenantSelect) {
                    api.openFrame({
                        name: 'orgSelect_frame',
                        url: './orgSelect_frame.html',
                        rect: {
                            x: 0,
                            y: headerH,
                            w: 'auto',
                            h: 'auto'
                        },
                        pageParam: {
                            name: 'test'
                        },
                        bounces: false,
                        bgColor: 'rgba(0,0,0,0.38)',
                    });
                } else {
                    api.sendEvent({
                        name: 'closeOrgSelectFrm',
                    });
                }
            },
            getTenantInfo() { //获取租户名字
                fnGet('services/app/Home/GetLoginInfo', {}, false, (ret, err) => {
                  api.hideProgress();
                    if (ret && ret.success) {
                        this.tenantName = ret.result.tenantInfo.tenantName;
                    }
                })
            },
            openSearchApp() { //打开搜索应用界面
                api.openWin({
                    name: 'searchApp',
                    url: './searchApp.html',
                    pageParam: {
                        name: 'test'
                    }
                });
            },
            openScan() { //打开扫描二维码登录界面
                FNScanner.open({
                    rect: {
                        x: 0,
                        y: 0,
                        w: api.winWidth,
                        h: api.winHeight,
                    },
                    autorotation: true,
                    hintText: "支持扫码快速登录电脑版云平台",
                    font: {
                        lightText: {
                            size: 13,
                        }
                    }
                }, function(ret, err) {
                    if (ret.eventType == 'success') {
                        api.openWin({
                            name: 'sureLoginPC',
                            url: './sureLoginPC.html',
                            pageParam: {
                                name: 'test'
                            }
                        });
                        // alert(JSON.stringify(ret))
                    }
                });
            },
            changeView() { //应用列表切换显示（栅格/列表）
                if (this.appView == 'list') {
                    this.appView = 'app'
                } else {
                    this.appView = 'list'
                }
                $api.setStorage('isAppOrList', this.appView);
            },
            initChart() {
                this.pieChartDom = echarts.init(this.$refs.pieChart);
                this.setPieOption();
            },
            setPieOption() {
                var option = {
                    color: ["#2696FF", "#FFB515", "#05E058"],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)",
                        position: 'inside'
                    },
                    series: [{
                        name: '我的任务',
                        type: 'pie',
                        radius: '80%',
                        center: ['50%', '50%'],
                        data: this.taskCountPie,
                        label: {
                            position: 'inside',
                            fontSize: 10,
                            formatter: function(e) {　　　　　
                                return e.percent + "%";　　
                            }
                        },
                        labelLine: {
                            length: 5,
                            length2: 5
                        }
                    }]
                };
                this.pieChartDom.setOption(option);
            },
            openMyTask(type) {
                api.openWin({
                    name: 'MyTask',
                    url: '../Task/MyTask.html',
                    bounces:api.systemType == 'ios'?true:false,
                    pageParam: {
                        type: type
                    }
                });
            },
            openMyInitiate() {
                api.openWin({
                    name: 'MyInitiate',
                    url: '../Task/MyInitiate.html',
                    bounces:api.systemType == 'ios'?true:false,
                });

            },
            openClaimTask() {
                api.openWin({
                    name: 'ClaimTask',
                    url: '../Task/ClaimTask.html',
                });
            },
            getAppList() { //获取应用列表
                fnGet('services/app/Home/GetHome', {}, false, (ret, err) => {
                    api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            if (ret.result != null) {
                                // 获取gis地图的配置
                                this.appData = ret.result.templateTitles;
                                // 19.12.12  保存应用列表到本地，用于无网络状态的时候，可以显示使用
                                var userLoginInformation = $api.getStorage('userLoginInformation');
                                userLoginInformation.appList = this.appData;
                                this.userLoginInformation.appList = this.appData;
                                $api.setStorage('userLoginInformation', userLoginInformation);
                                // 调用模块版本更新方法(组件化)
                                CheckAppVsersionByTeantId();

                                // 根据应用判断是否动态添加组件的js文件 6-2 zxf
                                // createReviewData();//创建表务任务需要的表
                                // createSelectData();//表务下拉数据表
                                // getSelectData(); //获取表务里面需要的下拉数据
                                // auditSelectData(); //获取稽核里面需要的下拉数据
                                // auditCreatTable();//创建稽核任务需要的表
                                this.addNewScriptToHtml();

                                this.showCbUpdateBtn = false; //抄表更新按钮是否显示（有抄表管家才可以）
                                for (var i = 0; i < this.appData.length; i++) {
                                    this.appData[i]['hide'] = false;
                                    var app = this.appData[i].applications;
                                    if (app == null) {
                                        app = []
                                    }
                                    for (var j = 0; j < app.length; j++) {
                                        var Authorization = [];
                                        var data1 = {
                                            key: app[j].thirdPartyUserId
                                        }
                                        Authorization.push(data1);
                                        var data2 = {
                                            key: app[j].thirdPartyPassWord
                                        }
                                        Authorization.push(data2);
                                        // console.log(JSON.stringify(app[j]));
                                        if (app[j].coding == 'WaterStarOne-CRM-S8') {
                                            $api.setStorage('kfapipath', app[j].appServerApi + '/Api/');
                                            $api.setStorage('kfUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('kfPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('kfHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-RIM-S8') {
                                            $api.setStorage('bzapipath', app[j].appServerApi + '/Api/');
                                            $api.setStorage('bzUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('bzPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('bzHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-AM-S8') {
                                             this.showClearDataBtn = true;
                                            $api.setStorage('jhapipath', app[j].appServerApi + '/api/');
                                            $api.setStorage('jhUserName', app[j].thirdPartyUserName);
                                            $api.setStorage('jhUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('jhPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('jhHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-MRH-S8') {
                                            this.showCbUpdateBtn = true;
                                            $api.setStorage('cbapipath', app[j].appServerApi);
                                            $api.setStorage('yptOperatorName', app[j].thirdPartyUserName);
                                            $api.setStorage('yptOperatorId', app[j].thirdPartyUserId);
                                            $api.setStorage('yptPassword', app[j].thirdPartyPassWord);
                                            $api.setStorage('cbHeaders', JSON.stringify(Authorization));
                                        } else if (app[j].coding == 'WaterStarOne-MMS-S8') {
                                          this.showClearDataBtn = true;
                                            $api.setStorage('bwapipath', app[j].appServerApi);
                                            $api.setStorage('bwUserName', app[j].thirdPartyUserName);
                                            $api.setStorage('bwUserId', app[j].thirdPartyUserId);
                                            $api.setStorage('bwPassWord', app[j].thirdPartyPassWord);
                                            $api.setStorage('bwHeaders', JSON.stringify(Authorization));
                                            waterCreatTable();
                                        }else{

                                            this.showClearDataBtn = false;
                                        }
                                        // if (app[j].productId == '10122') { //NewGis
                                        //     getAppMapSet();
                                        // }
                                    }
                                }
                            }
                        }
                    }
                });
            },
            hideAppList(i) { //点击箭头隐藏应用
                this.appData[i].hide = !this.appData[i].hide;
                this.appData = JSON.parse(JSON.stringify(this.appData));
            },
            alertClassify(app, index) { //弹出操作应用分类的弹窗
                api.openFrame({
                    name: 'classify_frame',
                    url: './classify_frame.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        classify: app,
                        index: index
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0.6)',
                });
            },
            addApp(id) { //添加应用
                api.openWin({
                    name: 'addApp',
                    url: './addApp.html',
                    slidBackEnabled: false,
                    pageParam: {
                        id: id
                    }
                });
            },
            openApp(data) { //打开应用
                var that = this;
                // api.sendEvent({
                //     name: 'freshHome',
                //     extra: {
                //         index: 0
                //     }
                // });

                if (data.openMobile) {
                    if ((data.iosPackage != "" && data.iosPackage != null) || (data.androidPackage != "" && data.androidPackage != null)) {
                        if (data.iosPackage != "" && data.iosPackage != null) {
                            if (api.systemType == 'ios') {
                                api.openApp({
                                    iosUrl: data.iosPackage,
                                    appParam: {},
                                }, function(ret, err) {

                                });
                            }
                        } else if (data.androidPackage != "" && data.androidPackage != null) {
                            //异步返回结果：
                            api.appInstalled({
                                appBundle: data.androidPackage
                            }, function(ret, err) {
                                if (ret.installed) {
                                    api.openApp({
                                        androidPkg: data.androidPackage,
                                        appParam: {},
                                    }, function(ret, err) {

                                    });

                                } else {
                                    //应用未安装
                                    api.toast({
                                        msg: '应用未安装',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                }
                            });
                        }
                    } else if (data.mobileWebUrl != "" && data.mobileWebUrl != null) {
                        if (data.mobileWebUrl.indexOf('http') != -1) {
                            api.openWin({
                                name: 'OA',
                                url: './OA.html',
                                pageParam: {
                                    url: data.mobileWebUrl,
                                    productId: data.productId
                                }
                            });
                        } else {
                            var winName = data.mobileWebUrl;
                            var index = winName.lastIndexOf('/');
                            var index2 = winName.indexOf('.html');
                            if (index != -1 && index2 != -1) {
                                winName = winName.substring(index + 1, index2);
                            }
                            if (data.coding == 'WaterStarOne-CRM-S8') {
                                if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                    api.toast({
                                        msg: '请先关联客服系统账号！',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                    return
                                }
                            } else if (data.coding == 'WaterStarOne-RIM-S8') {
                                if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                    api.toast({
                                        msg: '请先关联报装系统账号！',
                                        duration: 2000,
                                        location: 'top'
                                    });
                                    return
                                }
                            } else if (data.coding == 'WaterStarOne-AM-S8') {
                                // if (!data.thirdPartyUserId || !data.thirdPartyPassWord) {
                                //     api.toast({
                                //         msg: '请先关联稽核管理账号！',
                                //         duration: 2000,
                                //         location: 'top'
                                //     });
                                //     return
                                // }
                            }
                            api.openWin({
                                name: winName,
                                url: data.mobileWebUrl,
                                pageParam: {
                                    productId: data.productId
                                }
                            });

                        }
                    }
                }
            },
            getNotice() { //获取首页滚动播放的公告消息
                fnGet('services/app/Message/GetMessageList?MessageType=2&PageIndex=1&MaxResultCount=3', {}, false, function(ret, err) {
                  api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            MainVue.notices = ret.result.items;
                        }
                    }
                })
            },
            openNoticeDetail(notice) { //单击公告进入公告详情
                api.openWin({
                    name: 'NoticeDetails',
                    url: '../message/NoticeDetails.html',
                    pageParam: notice
                });
            },
            onRefresh() {
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            },
            GetUnconFirmedTaskCount() {
                var CurrentLocation = $api.getStorage('CurrentLocation');
                // 获取没有待领取的任务数量（用于判断是否显示一键领取）
                fnGet('services/app/WorkFlow/GetUnconFirmedTaskCount?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + $api.getStorage("jhUserName") + '&PassWord=' + $api.getStorage("jhPassWord") + '', {}, false,
                    (ret, err) => {
                      api.hideProgress();
                        if (ret) {
                            if (ret.success) {
                                if (ret.result != 0) {
                                    this.showClaimBtn = true;
                                    this.claimContent = "您有新收到的任务!";
                                } else {
                                    this.showClaimBtn = false;
                                    this.claimContent = '认领列表';
                                }
                            }
                        }
                    });
                // 获取任务认领列表
                // fnGet('services/app/WorkFlow/GetUnconFirmedTasks?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + $api.getStorage("jhUserName") + '&PassWord=' + $api.getStorage("jhPassWord") + '', {}, false, (
                //     ret, err) => {
                //     api.hideProgress();
                //     if (ret) {
                //         if (ret.success) {
                //             if (ret.result.length > 0) {
                //                 ret.result.forEach(e => {
                //                     e.time = new Date();
                //                 });
                //                 this.claimListData = ret.result;
                //             }
                //         }
                //     }
                // });
            },
            GetTaskCount() {
                var CurrentLocation = $api.getStorage('CurrentLocation');
                fnGet('services/app/WorkFlow/GetTaskCount?Lng=' + CurrentLocation.lon + '&Lat=' + CurrentLocation.lat + '&Account=' + $api.getStorage("jhUserName") + '&PassWord=' + $api.getStorage("jhPassWord") + '', {}, false, (ret, err) => {
                  api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                            var result = ret.result;
                            this.taskCountPie = [];
                            result.forEach(e => {
                                var obj = {
                                    value: e.count,
                                    name: e.statusFlagText
                                }
                                this.taskCountPie.push(obj);
                                switch (true) {
                                    case e.statusFlag == 99:
                                        this.taskCountSum.launchNumber = e.count;
                                        break;
                                    case e.statusFlag == 7:
                                        this.taskCountSum.waitNumber = e.count;
                                        break;
                                    case e.statusFlag == 4:
                                        this.taskCountSum.handledNumber = e.count;
                                        break;
                                }
                            });
                            var echartsObj = {
                                taskCountPie: this.taskCountPie,
                                launchNumber: this.taskCountSum.launchNumber,
                                waitNumber: this.taskCountSum.waitNumber,
                                handledNumber: this.taskCountSum.handledNumber,
                            }
                            this.userLoginInformation.echartsObj = {};
                            this.userLoginInformation.echartsObj = echartsObj;
                            this.userLoginInformation.tenantName = this.tenantName;
                            $api.setStorage('userLoginInformation', this.userLoginInformation);
                            this.initChart();
                        }
                    }
                });
            },
            isNetWork() { //判断当前是否有网络
              this.tenantName = this.userLoginInformation.tenantName != undefined ? this.userLoginInformation.tenantName : '';
                if (api.connectionType == 'none' || api.connectionType == '2g') {
                    this.taskClaimShow = false;
                    var userLoginInformation = $api.getStorage('userLoginInformation');
                    if (userLoginInformation != undefined) {
                        var echartsObj = userLoginInformation.echartsObj != undefined ? userLoginInformation.echartsObj : {};
                        this.appData = userLoginInformation.appList != undefined ? userLoginInformation.appList : [];
                        this.tenantName = this.userLoginInformation.tenantName != undefined ? this.userLoginInformation.tenantName : '';
                    }
                    this.showClearDataBtn = true;
                } else {
                    this.getTenantInfo();
                    this.getNotice();
                    this.getAppList();
                    // this.GetUnconFirmedTaskCount(); //查询任务领用数量
                    // this.GetTaskCount(); //获取任务数量统计，待处理，已处理等
                    onCommentGetClassify(function(ret){});//获取我的任务中筛选数据
                }

            },
            updateCbData() { //更新抄表数据
              dataQuery(false,function(ret){
              if(ret.status){
                api.openFrame({
                    name: 'delete_frame',
                    url: '../delete_frame.html',
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: 'auto'
                    },
                    pageParam: {
                        type:'updateCbData'
                    },
                    bounces: false,
                    bgColor: 'rgba(0,0,0,0.1)',
                });

              }else{
                api.openWin({
                    name: 'downLoadBasisData',
                    url: 'fs://wgt/MeterReading/html/downLoadBasisData.html',
                });
              }
            });
          },
          onClearLocalCompletedData(){
            api.openFrame({
                name: 'delete_frame',
                url: 'widget://html/delete_frame.html',
                rect: {
                    x: 0,
                    y: 0,
                    w: 'auto',
                    h: 'auto'
                },
                pageParam: {
                    type: 'ClearLocalCompletedData'
                },
                bounces: false,
                bgColor: 'rgba(0,0,0,0.1)',
            });
          },
          addNewScriptToHtml(){
            addNewScript(function(ret) {
              var hasAppList = ret;
               addDynamicallyScript(hasAppList,function(){
                 if(hasAppList.meterManageNumber!=0){ //判断表务应用是否存在。存在则调用创建表
                   reviewTableNew();//创建表务任务需要的表
                   createSelectData();//表务下拉数据表
                   getSelectData(); //获取表务里面需要的下拉数据
                   bwauditCreatTable();//创建停复水任务需要的表
                 }
                 if(hasAppList.auditNumber!=0){ //判断稽核应用是否存在。存在则调用创建表
                   auditSelectData(); //获取稽核里面需要的下拉数据
                   auditCreatTable();//创建稽核任务需要的表
                 }
               });
            });
          },
          fnCheckUpdate() {
              var mam = api.require('mam');
              mam.checkUpdate(function(ret, err) {
                  // console.log(JSON.stringify(ret))
                  // console.log(JSON.stringify(err))
                  if (ret.status) {
                      var result = ret.result;
                      if (result.update == true && result.closed == false) {
                          api.openFrame({
                              name: 'checkupdate_frm',
                              url: 'widget://html/mine/checkupdate_frm.html',
                              rect: {
                                  x: 0,
                                  y: 0,
                                  w: 'auto',
                                  h: 'auto'
                              },
                              pageParam: {
                                  version: result.version,
                                  updateTip: result.updateTip,
                                  source: result.source
                              },
                              bounces: false,
                              bgColor: 'rgba(0,0,0,0.4)',
                          });
                      }
                  }
              })
          }
        },
        mounted: function() {
            this.isNetWork();
            this.addNewScriptToHtml();
            this.fnCheckUpdate();
            oneMinuteCheckGPS(); //检测登录app1分钟后是否开启GPS
        },
        computed: {
            appList: function() {
                var data = JSON.parse(JSON.stringify(this.appData));
                var url = apiUrl;
                for (var i = 0; i < data.length; i++) {
                    data[i]['rowsData'] = [];
                    if (data[i].applications != null) {
                        var appData = data[i].applications;
                        for (var j = 0; j < appData.length; j++) {
                            appData[j]['logoUrl'] = url + appData[j].productIcon;
                        }
                        var addData = {
                            isAdd: true
                        }
                        appData.push(addData);
                        if (appData.length % 4 == 0) {
                            rows = (appData.length + 1) / 4;
                        } else {
                            rows = parseInt(appData.length / 4) + 1;
                        }
                        for (var k = 0; k < rows; k++) {
                            var arr = [];
                            for (var m = 4 * k; m < 4 * (k + 1); m++) {
                                if (appData[m] != null) {
                                    arr.push(appData[m]);
                                }
                            }
                            data[i].rowsData.push(arr);
                        }
                    } else {
                        data[i].applications = [];
                        var appData = data[i].applications;
                        var addData = {
                            isAdd: true
                        }
                        appData.push(addData);
                        if (appData.length % 4 == 0) {
                            rows = (appData.length + 1) / 4;
                        } else {
                            rows = parseInt(appData.length / 4) + 1;
                        }
                        for (var k = 0; k < rows; k++) {
                            var arr = [];
                            for (var m = 4 * k; m < 4 * (k + 1); m++) {
                                if (appData[m] != null) {
                                    arr.push(appData[m]);
                                }
                            }
                            data[i].rowsData.push(arr);
                        }
                    }
                }
                return data
            }
        },

    })
}

function closeView() {
    FNScanner.closeView();
}

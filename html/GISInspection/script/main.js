var isOnline;
apiready = function() {
  console.log('进入页面了');
  // api.closeFrameGroup({
  //   name: 'group'
  // });
  // 初始化为离线状态
  console.log(getCurrentUserRoles());
  if (getCurrentUserRoles()) {
    // 当为领导时，进入页面及在线
    console.log('领导');
    setOnlineStatus(0);
  } else {
    // 为员工时则初始化为离线状态
    setOnlineStatus(1);
  }

  api.addEventListener({
      name: 'keyback'
  }, function(ret, err) {
      if(ret){
        setOnlineStatus(1);
        api.closeWin();
        api.closeFrame({
          name: 'group1'
        });
        // api.closeWin({
        //   name:'inspectionMain'
        // });

        // setTimeout(function() {
        //   api.closeWin({});
        // }, 500);
        //
        // api.openWin({
        //     name: 'cloudMain',
        //     url: 'widget://html/main.html', //fs://wgt/public/html/main.html', //'../../html/main.html'
        //     bounces: false,
        //     reload: true,
        //     slidBackEnabled: false,
        //     animation: {
        //         type: "reveal", //动画类型（详见动画类型常量）
        //         subType: "from_bottom", //动画子类型（详见动画子类型常量）
        //         duration: 300 //动画过渡时间，默认300毫秒
        //     }
        // });
        // api.closeToWin({
        //     name: 'main'
        // });

        // api.openWin({
        //     name: 'cloudMain',
        //     url: 'widget://html/main.html',
        //     pageParam: {
        //         name: 'test'
        //     }
        // });

      }
  });
  // 设置状态栏为透明
  api.setStatusBarStyle({
    style: 'dark',
    color:'transparent'
  });

  console.log(1111111111111111111);
  // api.addEventListener({
  //     name: 'isOnline'
  // }, function(ret, err){
  //     if( ret ){
  //          console.log(JSON.stringify(ret));
  //
  //         //  memberStatus为1代表在线
  //         isOnline = ret.value.memberStatus;
  //         if (isOnline) {
  //           // 在线则每五分钟上传定位
  //           uploadLocation()
  //         } else {
  //           clearInterval(timer);
  //           console.log('清除了定时器');
  //         }
  //     }else{
  //         console.log( JSON.stringify( err ));
  //         clearInterval(timer);
  //     }
  // });

  api.addEventListener({
      name: 'closeEvent',
  }, function(ret, err){
      if( ret ){
          api.sendEvent({
              name: 'eventMethod',
              extra: {
                  index: ret.value.index
              }
          });

      }else{
           alert( JSON.stringify( err ) );
      }
  });


  api.addEventListener({
      name: 'returnEvent'
  }, function(ret, err){
      if( ret ){
          api.setFrameGroupIndex({
            name: 'group1',
            index: 2,
            reload: true
        });
        var el = $("#footer-gis .flex1")[2];
        $("#footer-gis .flex1").removeClass('color-598');
        $(el).addClass('color-598');

        $('.type-line').removeClass('bgc-blue');
        $(el).children().children().addClass('bgc-blue');

      }else{
           alert( JSON.stringify( err ) );
      }
  });

  // api.addEventListener({
  //     name: 'freshHome'
  // }, function(ret, err){
  //     if( ret ){
  //          console.log( JSON.stringify( ret ) );
  //     }else{
  //          console.log( JSON.stringify( err ) );
  //     }
  // });
    console.log(getCurrentUserRoles());
    funIniGroup(getCurrentUserRoles());
    WinSize(['footer-gis']);
}


function funIniGroup(roles) {
  // console.log('111111111111111111111111');
  // console.log(roles);
    api.openFrameGroup({
        name: 'group1',
        scrollEnabled: false,
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: 'auto',
            marginLeft: 0,
            marginTop: 0,
            marginBottom: $api.dom('.footer-gis').offsetHeight,
            marginRight: 0
        },
        bounces: false,
        index: 0,
        preload: 4,
        reload: true,

        frames: [{
            name: 'home_frame',
            url: roles==0?'../html/Home/home.html':'../html/Home/leaderHome.html',
            // url:'../html/Home/home.html',
            scrollEnabled: true,
            vScrollBarEnabled: true,
            hScrollBarEnabled: false,
        }, {
            name: 'task_frame',
            url: '../html/Task/task.html'
        }, {
            name: 'method_frame',
            url: '../html/Method/method.html',
        }, {
            name: 'job_frame',
            url: '../html/Job/job.html',
        }, {
            name: 'area_frame',
            url: '../html/Area/area.html',
        }]
    }, function(ret, err) {
      console.log(JSON.stringify(ret));
      if (ret) {
        if (ret.index == 0) {
          console.log('触发了');
          api.setFrameGroupIndex({
              name: 'group1',
              index: 0,
              reload: true
          });
        }
      }
    });
}

function onFotterMenu(index, el) {
  api.setFrameGroupIndex({
      name: 'group1',
      index: index,
  });

  $('.flex1').removeClass('color-598');
  $(el).addClass('color-598');

  $('.type-line').removeClass('bgc-blue');
  $(el).children().children().addClass('bgc-blue');
}

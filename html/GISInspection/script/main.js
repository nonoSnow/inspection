var isOnline;
apiready = function() {
  // 设置状态栏为透明
  api.setStatusBarStyle({
    style: 'dark',
    color:'transparent'
  });

  api.addEventListener({
      name: 'isOnline'
  }, function(ret, err){
      if( ret ){
           console.log(JSON.stringify(ret));
          //  memberStatus为1代表在线
          isOnline = ret.value.memberStatus;
          if (isOnline) {
            // 在线则每五分钟上传定位
            uploadLocation()
          } else {
            clearInterval(timer);
            console.log('清除了定时器');
          }
      }else{
          console.log( JSON.stringify( err ));
          clearInterval(timer);
      }
  });

  funIniGroup();

  WinSize(['footer-gis']);
  // alert(JSON.stringify($api.getStorage('userLoginInformation')))
  // alert(JSON.stringify($api.getStorage('userLoginInformation').loginSuccessData.userId));
  // 获取当前用户角色（领导还是员工）
  var userId = $api.getStorage('userLoginInformation').loginSuccessData.userId;
  var data = {
    userId: userId
  }

  getRoles(data);
}

// 获取当前用户角色
function getRoles (data) {
  getUserRoles('api/services/app/Role/GetUserRolesById', data, showRet, showErr);

  function showRet(ret) {
    console.log(JSON.stringify(ret));
    if (ret.result.length != 0) {
      ret.result.forEach(function(item) {
        if (item.roleName == '领导') {
          // 当前用户角色为领导
          $api.setStorage('isLeader', true);

          return false;
        } else if(item.roleName == '员工') {
          $api.setStorage('isLeader', false);

          return false;
        } else {
          // 既没有领导角色也没有员工角色，则默认为员工角色
          $api.setStorage('isLeader', false);
        }
      })
    }
    console.log($api.getStorage('isLeader'));
  }

  function showErr(err) {
    $('#haveNothing').removeClass('aui-hide');
    if (err.body.error != undefined) {
      api.toast({
          msg: err.body.error.message,
          duration: 2000,
          location: 'middle'
      });
    } else {
      api.toast({
          msg: err.msg,
          duration: 2000,
          location: 'middle'
      });
    }
  }
}

function funIniGroup() {
    api.openFrameGroup({
        name: 'group',
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
            url: '../html/Home/home.html',
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
    }, function(ret, err) {});
}

function onFotterMenu(index, el) {
  api.setFrameGroupIndex({
      name: 'group',
      index: index,
  });

  $('.flex1').removeClass('color-598');
  $(el).addClass('color-598');

  $('.type-line').removeClass('bgc-blue');
  $(el).children().children().addClass('bgc-blue');
}

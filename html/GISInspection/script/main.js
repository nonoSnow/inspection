
apiready = function() {
  // 设置状态栏为透明
  api.setStatusBarStyle({
    style: 'dark',
    color:'transparent'
  });

  funIniGroup();
}

function onBack() {
  api.closeWin({});
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

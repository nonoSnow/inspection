var statusType = 0;
var pageIndex = 1; //分页
var listDatas =[];
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);
    $('.header-type-item').on('click', function() {
        $(this).siblings().removeClass('color-598');
        $(this).siblings().find('.type-line').removeClass('bgc-blue');
        $(this).find('.type-line').addClass('bgc-blue');
        $(this).addClass('color-598');
        pageIndex=1;
        statusType = parseInt($(this).attr('data-type'));
        getAppGetAllPerson(false);
    })
    appGetPersonCount(); //获取人员数量
    getAppGetAllPerson(true);
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
      if(listDatas.length!=0){
        pageIndex++;
        getAppGetAllPerson(true);
      }else{
        api.toast({
            msg: '没有更多数据了!',
            duration: 2000,
            location: 'bottom'
        });
      }

    });

}

function appGetPersonCount() {
    var options = {
        url: requestUrl + 'PersonService/AppGetPersonCount',
        type: "post",
        data: {},
        success: function(ret) {
            if (ret.success) {
                $('#allPersons').text('全部(' + ret.result.all + ')');
                $('#onliePersons').text('在线(' + ret.result.online + ')');
                $('#offlinePersons').text('离线(' + ret.result.offline + ')');
            }
        },
        error: function(err) {},

    }
    ajaxMethod(options);
}

function getAppGetAllPerson(isScroll) {
    var data = {
        status: statusType,
        pageIndex: pageIndex,
        maxResultCount: 10
    }
    var options = {
        url: requestUrl + 'PersonService/AppGetAllPerson',
        type: "post",
        data: data,
        success: function(ret) {
          console.log(JSON.stringify(ret));
            if (ret.success) {
                ret.result.items.forEach(function(item) {
                  if (item.onlineTime != null) {
                    item.onlineTime = moment(item.onlineTime).format('YYYY-MM-DD HH:mm');
                  }
                  if (item.offlineTime != null) {
                    item.offlineTime = moment(item.offlineTime).format('YYYY-MM-DD HH:mm');
                  }
                  if (item.duration != 0) {
                    item.duration = item.duration.toFixed(2);
                  }
                });

                var str = template('personListTemplate', ret);
                listDatas = ret.result.items;
                // console.log(JSON.stringify(listDatas));
                if (!isScroll) {
                    $('#personListDemo').html("");
                }
                $('#personListDemo').append(str);
            }
        },
        error: function(err) {},

    }
    ajaxMethod(options);
}

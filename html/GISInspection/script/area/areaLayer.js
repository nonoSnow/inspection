
// 设备、管道数据
var pointsArr = lines = [];

// 选中的数据
var checkedArr = [];

apiready = function() {
  var header = $api.byId('header');
  // 实现沉浸式状态栏效果
  $api.fixStatusBar(header);

  onGetData();
}

function onMenu(index, el) {
  onCheckMenu(el, function(){
    document.getElementById('contBox').scrollTop = 0;
    if (index == '0') {
      $("#layerList1").addClass('aui-hide');
      $("#layerList").removeClass('aui-hide');
    } else if (index == '1') {
      $("#layerList").addClass('aui-hide');
      $("#layerList1").removeClass('aui-hide');
    }
  });
}

function onGetData() {
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  var option = {
      url: gisUrl + 'GisStyleIconService/GetStyleIcon',
      type: 'get',
      timeout: 30,
      error: function(err) {
          api.hideProgress();
          if (err.body.error == undefined) {
            api.toast({
                msg: err.msg,
                duration: 2000,
                location: 'middle'
            });
          } else {
            api.toast({
                msg: err.body.error.message,
                duration: 2000,
                location: 'middle'
            });
          }
          console.log(JSON.stringify(err));
      },
      success: function(ret) {
          api.hideProgress();
          pointsArr = ret.result.points;
          lines = ret.result.lines;
          for (var i = 0; i < pointsArr.length; i++) {
            var childrenArr = pointsArr[i].children;
            pointsArr[i].urlApi = gisUrl.substring(0, (gisUrl.length - 1));
            if ((childrenArr.length)%4 != 0) {
              var childrenLength = 4 - (childrenArr.length)%4;
              for (var j = 0; j < childrenLength; j++) {
                pointsArr[i].children.push('');
              }
            }
          }

          for (var i = 0; i < lines.length; i++) {
            var childrenArr = lines[i].children;
            lines[i].urlApi = gisUrl.substring(0, (gisUrl.length - 1));
            if ((childrenArr.length)%4 != 0) {
              var childrenLength = 4 - (childrenArr.length)%4;
              for (var j = 0; j < childrenLength; j++) {
                lines[i].children.push('');
              }
            }
          }
          onShowHtml(pointsArr, '0');
          onShowHtml(lines, '1');
      }
  };
  ajaxMethod(option);
}

function onShowHtml(showArr, showType) {
  var datas = {
    datas: showArr
  };
  if (showType == '0') {
    var str = template('pointAndLine', datas);
    $('#layerList').empty();
    $('#layerList').append(str);
  } else if (showType == '1') {
    var str = template('pointAndLine', datas);
    $('#layerList1').empty();
    $('#layerList1').append(str);
  }
}

function onCheckArr(el) {
  if($(el).is(':checked')){
      $('input[name="'+ $(el).attr('name') +'"]').each(function(){
          $(this).prop("checked",true);
      });
  }else{
      $('input[name="'+ $(el).attr('name') +'"]').each(function(){
          $(this).prop("checked",false);
      });
  }
}

function onCheckItem(el) {
  var isEhecked = true;
  if ($(el)[0].checked) {
    $('input[name="'+ $(el).attr('name') +'"]').each(function(index){
        if (!$(this).prop("checked") && index != 0) {
          isEhecked = false;
        }
    });
    if (!isEhecked) {
      onInputEhecked(el, false);
    } else {
      onInputEhecked(el, true);
    }
  } else {
    onInputEhecked(el, false);
  }
}

function onInputEhecked(el, isEhecked) {
  $('input[name="'+ $(el).attr('name') +'"]').each(function(index){
      if (index == 0) {
        $(this).prop("checked",isEhecked);
      }
  });
}

function onSave() {
  $(".layerItem input:checked").each(function(i){
    checkedArr.push(JSON.parse($(this).attr('item')));
  });
  if (checkedArr.length == 0) {
    var dialog = new auiDialog({});
    dialog.alert({
        title:"请先选择数据",
        buttons:['取消','确定']
    },function(ret){

    });
    return;
  }
  api.openWin({
      name: 'areaDivide',
      url: './areaDivide.html',
      pageParam: {
          checkedArr: checkedArr,
          addAreaPoint: []
      }
  });
}

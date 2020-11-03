
var headArr = [];
var checkHeadObj;

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);
    getIndexesData();
    onGetData();
    $('#search-input').on({
      'input propertychange': function() {
          // console.log($(this).val());
        }
    })
}
// 点击搜索
function search(){
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '搜索中...',
      modal: false
  });
  console.log($("#search-input").val());
  var scrollVal = $("#search-input").val();

  var options={
    data:"",
    type:'get',
    scrollVal:scrollVal,
    success:showRet,
    error:showErr,
  }
  // 请求接口 获取数据
  getAjaxSearchHeadList(options);
  // jobGetMethod("api/services/app/Information/GetSelectPersonnelAsync?key="+scrollVal,"",showRet,showErr);
  function showRet(ret){
    api.hideProgress();
    $('.head-list').html('');
    if(ret.success){
        headArr = ret.result;
        var returnData =  pySegSort(headArr);
        var listData = {items: returnData};
        var str = template('headList', listData);
        $('.head-list').append(str);
    }
  }

  function showErr(err){
    api.hideProgress();
    console.log(JSON.stringify(err));
    if(err.body){
      alert(err.body)
    }else {
      alert("加载失败")
    }
  }
}
// 请求接口获取人员列表
function onGetData() {
    // alert("1")
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '加载中...',
        modal: false
    });
    var options={
      data:"",
      type:'get',
      success:showRet,
      error:showErr,
    }
    // 请求接口 获取数据
    getAjaxHeadList(options);
    // jobGetMethod("api/services/app/Information/GetOrganizationAndPersonnel","",showRet,showErr);
    function showRet(ret){
      api.hideProgress();
      $('.head-list').html('');
      if(ret.success){
          headArr = ret.result.personnelAll;
          var returnData =  pySegSort(headArr);
          var listData = {items: returnData};
          var str = template('headList', listData);
          $('.head-list').append(str);
      }
    }

    function showErr(err){
      api.hideProgress();
      if(err.body){
        alert(err.body)
      }else {
        alert("加载失败")
      }
    }
}

function getIndexesData() {
  var indexesData = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  indexesData.forEach(function (item, i) {
      var indexesItem =
        "<p>" +
          "<a href='#title"+ item +"' id='index"+ item +"' name='index"+ item +"'>"+ item +"</a>" +
        "</p>";
      $(".list-Indexes").append(indexesItem);
  });
}

//根据拼音首字母返回分组
function pySegSort(arr) {
  pyArr = arr.map(o => {
    return  Pinyin.getWordsCode(o.name.substring(0,1));
  });

  var letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split('');
  var segs = [];
  var data = [];
  var curr = {};
  letters.forEach(function(item,i){

    data = [];
    pyArr.forEach(function(item2, j){
      if (item == item2) {
        data.push(arr[j]);
      }
    });
    segs.push({'letter': item, 'data': data});
  });
  return segs;
}

// 选中负责人
function checkHead(el){
  checkHeadObj = $(el).attr('param');
  $("#sure").removeClass('aui-hide')
}
// 确定请求接口 传递数据
function onCheck(){
  console.log(checkHeadObj);
  api.sendEvent({
      name: 'headList',
      extra: {
          checkHeadObj
      }
  });
  // api.openWin({
  //     name: 'addJob',
  //     url: './addJob.html'
  // });
  api.closeWin();
  // alert($(el).attr('param'))
}

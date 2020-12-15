
var headArr = [];
var checkHeadObj;

// 是否是转工单进来的
var transOrder = false;
var personInfo = {};

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

    if (api.pageParam.type == 'transOrder') {
      transOrder = true;
      personInfo = api.pageParam.personInfo;
    } else {
      transOrder = false;
    }
}
// 点击搜索
function search(){
  api.showProgress({
      style: 'default',
      animationType: 'fade',
      title: '搜索中...',
      modal: false
  });
  // console.log($("#search-input").val());
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
    // console.log(JSON.stringify(err));
    // if(err.body){
    //   alert(err.body)
    // }else {
    //   alert("加载失败")
    // }
  }
}
// 请求接口获取人员列表
function onGetData() {
  // console.log('请求了人员列表接口');
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
      // console.log(JSON.stringify(ret));
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

      // if(err.body.error){
      //   alert(err.body)
      // }else {
      //   alert("加载失败")
      // }
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
  // console.log(JSON.stringify(checkHeadObj));
  $("#sure").removeClass('aui-hide')
}
// 确定请求接口 传递数据
function onCheck(){
  // console.log(JSON.stringify(checkHeadObj));
  // console.log(transOrder);
  // console.log(JSON.stringify(personInfo));
  // console.log(JSON.stringify(checkHeadObj));
  // console.log(typeof(checkHeadObj));
  var checkPerson = JSON.parse(checkHeadObj);
  if (transOrder) {
    // console.log(checkPerson.userId == personInfo.userId);
    if (checkPerson.userId == personInfo.userId) {
      api.toast({
          msg: '无法给自己转派工单！',
          duration: 2000,
          location: 'middle'
      });
      return false;
    } else {
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
    }
  } else {
    api.sendEvent({
        name: 'headList',
        extra: {
            checkHeadObj
        }
    });
    api.closeWin();
  }



  // alert($(el).attr('param'))
}

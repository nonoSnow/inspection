
var headArr = [];
var checkId;

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    getIndexesData();
    onGetData();
}

// 请求接口获取人员列表
function onGetData() {
    getUserList("api/services/app/Information/GetOrganizationAndPersonnel","",showRet,showErr);
    function showRet(ret){
      console.log(JSON.stringify(ret));
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
      console.log(JSON.stringify(err));
      if(err.body){
        alert(err.body)
      }else {
        alert("加载失败")
      }
    }
}

// function onGetData() {
//     headArr = [{id:'1',Name: '阿西吧', Phone: '123456'},{id:'2',Name: '阿哦哦', Phone: '123456'},{id:'3',Name: '阿哦哦', Phone: '123456'},{id:'4',Name: '阿哦哦', Phone: '123456'},{id:'5',Name: '吃西吧', Phone: '123456'},{id:'6',Name: '吧西吧', Phone: '123456'},{id:'7',Name: '看西吧', Phone: '123456'}];
//
//     var returnData =  pySegSort(headArr);
//     var listData = {items: returnData};
//     var str = template('headList', listData);
//     $('.head-list').append(str);
// }

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
    return  Pinyin.getWordsCode(o.Name.substring(0,1));
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
  checkId = $(el).attr('param');
  $("#sure").removeClass('aui-hide')
}
// 确定请求接口 传递数据
function onCheck(){
  alert(checkId)
  // alert($(el).attr('param'))
}

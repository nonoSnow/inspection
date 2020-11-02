
var headArr = [];

apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);

    getIndexesData();
    onGetData();
}

function onGetData() {
    headArr = [{Name: '阿西吧', Phone: '123456'},{Name: '阿哦哦', Phone: '123456'},{Name: '阿哦哦', Phone: '123456'},{Name: '阿哦哦', Phone: '123456'},{Name: '吃西吧', Phone: '123456'},{Name: '吧西吧', Phone: '123456'},{Name: '看西吧', Phone: '123456'}];

    var returnData =  pySegSort(headArr);
    var listData = {items: returnData};
    var str = template('headList', listData);
    $('.head-list').append(str);
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

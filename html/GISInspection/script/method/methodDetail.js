var methodType;

apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  methodType = api.pageParam.type;
  showDetailsData(api.pageParam.id)
}

// 获取事件详情
function showDetailsData(id){
  var data = {
    Id: id
  }
  getEventDetail("api/services/Inspection/EventService/GetEventDetails",data,showRet,showErr);
  function showRet(ret){
    // console.log(JSON.stringify(ret));
    alert(JSON.stringify(ret))
    $('#detailList').html('');
    var data = {
      list: {}
    };
    var str = template("methodList", data);
    $('#detailList').append(str);
  }

  function showErr(err){
    // console.log(JSON.stringify(err));
    if(err.body.error.message){
      alert(err.body.error.message)
    }else {
      alert("加载失败")
    }
  }
}

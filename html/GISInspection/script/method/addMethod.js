
apiready = function() {
    var header = $api.byId('header');
    // 实现沉浸式状态栏效果
    $api.fixStatusBar(header);
    // 点击选择事件类型
    $(".custom-popup-list li").each(function() {
      $(this).click(function() {
        // alert($(this).text())
        $('#methodType').val($(this).text());
        $('.custom-popup-item').removeClass('color-598');
        $(this).addClass('color-598');
        onHidePopup();
      });
    });
    // 点击选择异常类型
    $(".abnormal-type-list label").each(function() {
      $(this).click(function() {
          // alert($(this).text())
          $('#abnormalType').val($(this).text());

          var chk_value = [];

          $('input[name="checkbox"]:checked').each(function(){ //遍历，将所有选中的值放到数组中
              var res = $(this).val();
              chk_value.push(res)
              console.log(res)

          });

          alert(chk_value.length==0 ?'你还没有选择任何内容！':chk_value);


      });
    });

    onSubmit();
}
var popup = new auiPopup();
// 点击确定关闭弹窗
function saveCheck (){
  onHideAbnormalTypPopup();
}
// 关闭事件类型弹窗
function onHidePopup(){
    popup.hide(document.getElementById("methodTypePop"));
}
// 关闭异常类型弹窗
function onHideAbnormalTypPopup(){
    popup.hide(document.getElementById("abnormalTypePop"));
}

// 提交事件添加
function onSubmit(){
  var data = {
    type:0,
    errorType:'',
    taskId:0,
    status:0,
    waterLoss:'',
    content:'',
    resourceInfoList:[]
  }
  getEventInsert("api/services/Inspection/EventService/InsertEvent",data,showRet,showErr);
  function showRet(ret){
    alert(JSON.stringify(ret));
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

function onOpenArea(type) {
  api.openWin({
      name: 'area',
      url: '../area/area.html',
      pageParam: {
          type: type
      }
  });

}
// 点击拍照弹出选择框，拍照或相册选择
function uploadPhoto() {
  api.actionSheet({
      buttons: ['拍照', '相册选择']
  }, function(ret, err) {
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(err));
    if (ret.buttonIndex == 1) {
      // 选择了拍照
      var type = 'camera';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        console.log(JSON.stringify(ret));
        imgList.push(ret);
        showImg(imgList);
      }

      function showErr(err) {
        console.log(JSON.stringify(err));
        // showImg(imgList);
      }

      // showImg(imgList);
    } else if (ret.buttonIndex == 2) {
      // 选择了从相册选择
      var type = 'album';
      getPicture(type, showRet, showErr);

      function showRet(ret) {
        console.log(JSON.stringify(ret));
        imgList.push(ret[0]);
        console.log(JSON.stringify(imgList));
        showImg(imgList);
      }

      function showErr(err) {
        console.log(JSON.stringify(err));
        // showImg(imgList);
      }


    }
  })
}

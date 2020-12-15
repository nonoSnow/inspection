/*
#数据合法性；调用方法之前判断
*/
var allUrl=''
//监听URL的改变
// var allUrl='http://'+$api.getStorage('apiUrl');
// console.log($api.getStorage('apiUrl')==='192.168.10.33:8188');
// console.log($api.getStorage('apiUrl').slice(0,13) === '192.168.10.33');
if($api.getStorage('apiUrl').slice(0,7) === '192.168'){
  allUrl=$api.getStorage('cqappServerApiIntranet');
}else {
  allUrl=$api.getStorage('cqapipath');
}
// var ceshiUrl = 'http://192.168.9.175:7052';
// var ceshiUrl1 = 'http://192.168.10.219:8093';

// 测试地址的请求
// function NewPost1(path, data, token, callback) {
//   // console.log(allUrl);
//     api.hideProgress();
//     api.showProgress({
//         title: '加载中',
//         text: '',
//         modal: false
//     });
//     if(api.connectionType == 'none'){
//       api.toast({
//           msg: '网络连接错误,请检查网络是否连接',
//           duration: 2000,
//           location: 'bottom'
//       });
//       return false;
//     }
//     if(token){
//       var headers={
//         'Token':token,
//         'Content-Type':'application/json'
//       }
//     }else {
//       var headers={
//         'Content-Type':'application/json'
//       }
//     }
//     // console.log(JSON.stringify(data));
//     // console.log(allUrl + path);
//     // console.log(JSON.stringify(headers));
//     api.ajax({
//         // url: allUrl + path,
//         url: ceshiUrl + path,
//         method: 'post',
//         timeout: 30,
//         dataType: 'json',
//         headers: headers,
//         data:{
//           body:data
//         }
//     }, function(ret, err) {
//       //  console.log(JSON.stringify(ret));
//       //  console.log(JSON.stringify(err));
//       api.hideProgress();
//       if(ret){
//         callback(ret, err);
//       }else {
//         console.log(JSON.stringify(err));
//         api.toast({
//             msg:err.msg,
//             duration: 2000,
//             location: 'top'
//         });
//       }
//     })
// };
//
// function NewGet1(path,data,token,callback){
//   console.log();
//   api.hideProgress();
//   api.showProgress({
//       title: '加载中',
//       text: '',
//       modal: false
//   });
//   if(api.connectionType == 'none'){
//     api.toast({
//         msg: '网络连接错误,请检查网络是否连接',
//         duration: 2000,
//         location: 'bottom'
//     });
//     return false;
//   }
//   if(token){
//     var headers={
//       'Token':token,
//       'Content-Type':'application/json'
//     }
//   }else {
//     var headers={
//       'Content-Type':'application/json'
//     }
//   }
//   // console.log(JSON.stringify(data));
//   console.log(JSON.stringify(ceshiUrl + path));
//   // console.log(JSON.stringify(headers));
//   api.ajax({
//       // url: allUrl+url,
//       url: ceshiUrl + path,
//       method: 'get',
//       timeout: 30,
//       dataType: 'json',
//       headers:headers,
//       data:{
//         body:data
//       }
//   },function(ret, err){
//     //  console.log(JSON.stringify(ret));
//     //  console.log(JSON.stringify(err));
//       api.hideProgress();
//       if(ret){
//         callback(ret, err);
//       }else {
//         api.toast({
//             msg:err.msg,
//             duration: 2000,
//             location: 'top'
//         });
//       }
//   });
// }


/*POST
url 请求地址
data携带数据
POST部分需要在headers带上TOKEN 需要进行判断
*/
function NewPost(path, data, token, callback) {
  // console.log(allUrl);
    api.hideProgress();
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return false;
    }
    if(token){
      var headers={
        'Token':token,
        'Content-Type':'application/json'
      }
    }else {
      var headers={
        'Content-Type':'application/json'
      }
    }
    // console.log(JSON.stringify(data));
    // console.log(allUrl + path);
    // console.log(JSON.stringify(headers));
    // console.log(ceshiUrl + path);
    api.ajax({
        url: allUrl + path,
        // url: ceshiUrl + path,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        headers: headers,
        data:{
          body:data
        }
    }, function(ret, err) {
      //  console.log(JSON.stringify(ret));
      //  console.log(JSON.stringify(err));
      api.hideProgress();
      if(ret){
        callback(ret, err);
      }else {
        console.log(JSON.stringify(err));
        api.toast({
            msg:err.msg,
            duration: 2000,
            location: 'top'
        });
      }
    })
};
/*POST
需要返回所有请求信息
一般作为阻止重复提交的一个判断

*/
function NewPostMA(path, data, token, callback) {
    api.hideProgress();
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return false;
    }
    if(token){
      var headers={
        'Token':token,
        'Content-Type':'application/json'
      }
    }else {
      var headers={
        'Content-Type':'application/json'
      }
    }
    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(allUrl + path));
    // console.log(JSON.stringify(headers));
    api.ajax({
        url: allUrl + path,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        headers: headers,
        data:{
          body:data
        }
    }, function(ret, err) {
      //  console.log(JSON.stringify(ret));
      //  console.log(JSON.stringify(err));
      api.hideProgress();
      callback(ret, err);
    })
};
/*GET
url 请求地址
data携带数据
GET请求必须在headers带上TOKEN
*/
function NewGet(path,data,token,callback){
  api.hideProgress();
  api.showProgress({
      title: '加载中',
      text: '',
      modal: false
  });
  if(api.connectionType == 'none'){
    api.toast({
        msg: '网络连接错误,请检查网络是否连接',
        duration: 2000,
        location: 'bottom'
    });
    return false;
  }
  if(token){
    var headers={
      'Token':token,
      'Content-Type':'application/json'
    }
  }else {
    var headers={
      'Content-Type':'application/json'
    }
  }
  // console.log(JSON.stringify(data));
  // console.log(JSON.stringify(allUrl + url));
  // console.log(JSON.stringify(headers));
  // console.log(JSON.stringify(ceshiUrl + path));
  api.ajax({
      url: allUrl+path,
      // url: ceshiUrl + path,
      method: 'get',
      timeout: 30,
      dataType: 'json',
      headers:headers,
      data:{
        body:data
      }
  },function(ret, err){
    //  console.log(JSON.stringify(ret));
    //  console.log(JSON.stringify(err));
      api.hideProgress();
      if(ret){
        callback(ret, err);
      }else {
        // console.log(JSON.stringify(err));
        api.toast({
            msg:err.msg,
            duration: 2000,
            location: 'top'
        });
      }
  });
}
//图片上传 返回错误信息
function NewPostImg(path, data, token, callback) {
    api.hideProgress();
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return false;
    }
    if(token){
      var headers={
        'Token':token
      }
    }
    // console.log(JSON.stringify(data.get('MyFile')));
    // console.log(JSON.stringify(allUrl + path));
    // console.log(JSON.stringify(headers));
    api.ajax({
        url: allUrl + path,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        headers: headers,
        data:{
          files:data
        }
    }, function(ret, err) {
      api.hideProgress();
      callback(ret, err);
    })
};

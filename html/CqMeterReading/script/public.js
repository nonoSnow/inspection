//页面hearder 高度计算
function headerHeight(){
    var header = $api.byId('header');
    $api.fixStatusBar(header);
    headerH = $api.offset(header).h;
    $('#content').css('padding-top', '' + headerH + 'px');
    api.setStatusBarStyle({
        style:"dark"
    })
};
$.fn.parseForm=function(){
	let serializeObj={};
	let array=this.serializeArray();
	let str=this.serialize();
	$(array).each(function(){
		if(serializeObj[this.name]){
			if($.isArray(serializeObj[this.name])){
				serializeObj[this.name].push(this.value);
			}else{
				serializeObj[this.name]=[serializeObj[this.name],this.value];
			}
		}else{
			serializeObj[this.name]=this.value;
		}
	});
	return serializeObj;
};
// 关闭窗口
function backwin(){
    api.closeWin();
};
// 关闭frome
function backframe() {
    api.closeFrame();
}
// 删除指定数组里面的指定元素
function removeArrValue(arr,value){
  for(let i=0;i<arr.length;i++){
    if(arr[i].StampNo===value.StampNo){
      arr.splice(i,1)
      break;
    }
  }
  return arr;
}
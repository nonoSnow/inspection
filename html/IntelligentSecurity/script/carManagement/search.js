
apiready = function() {
  var header = $api.byId('header');
  $api.fixStatusBar(header);
  var headerH = $("#header").height();
}

function onGetSearchVal() {
  var searchVal = $("#search-input").val();
  if (searchVal != '' && searchVal != ' ') {
    $('.search-btn').addClass('color-598');
    $('.aui-searchbar-clear-btn').css('display', 'inline-block');
  } else {
    $('.search-btn').removeClass('color-598');
    $('.aui-searchbar-clear-btn').css('display', 'none');
  }
}

function onEmpty() {
  $("#search-input").val('');
  onGetSearchVal();
}

function onGetList() {
  console.log('click-search');
}

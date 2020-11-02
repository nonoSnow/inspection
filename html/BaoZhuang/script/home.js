
apiready = function() {
    var header = $api.byId('header');
    $api.fixStatusBar(header);

    fnIntVue();
    Origami.fastclick(document.body) //消除vue的ios端点击延迟
};

function fnIntVue() {
    window.MainVue = new Vue({
        el: '#wrap',
        data: {
            needDealt: '9527',
            completeDealt: '857'
        },
        methods: {
            onBack() {
                api.closeWin({});
            },
            onOpenTaskList(type) {
              if (type == 'need') {
                api.openWin({
                    name: 'TaskList',
                    url: './html/Task/TaskList.html',
                    pageParam: {
                        type: 'handle'
                    }
                });
              } else if (type == 'complete') {
                api.openWin({
                    name: 'TaskList',
                    url: './html/Task/TaskList.html',
                    pageParam: {
                        type: 'detail'
                    }
                });
              }
            }
        },
        mounted: function() {

        }
    })
}

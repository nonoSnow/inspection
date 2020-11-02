/**
 * TaskItem.js
 * 任务办理-详情组件
 */
 if (Vue) {
   Vue.component('task-item', {
     props: {
       itemtitletext: String, // 标题
       itemstatus: String,
       itemarr: {
         type: Array,
         default: function() { return []; }
       }, // 内容
     },
    data: function() {
      return {

      };
    },
    methods: {
      onBack() {
        api.closeWin({});
      },
      onRightMethod() {
        if (this.rightmethod) {
          this.rightmethod();
        }
      }
    },
    mounted: function() {
      console.log(this.itemtitletext);
      console.log(this.itemstatus);
      console.log(JSON.stringify(this.itemarr));
    },
    template:
    "<div class='item'>" +
      "<div class='item-cont'>" +
        "<div class='item-cont-cont'>" +
          "<van-collapse v-model='itemstatus' accordion>" +
            "<van-collapse-item name='1'>" +
              "<template #title>" +
                "<span class='item-title-text'>{{itemtitletext}}</span>" +
              "</template>" +
              "<div class='title-xian'></div>" +
              "<div v-for='(item, index) in itemarr' :key='index'>" +
                "<div class='item-item'>" +
                  "<div class='text-left'>" +
                      "<span class='text-left-title'>{{item.itemtitle}}</span>:" +
                  "</div>" +
                  "<div class='text-right'>" +
                    "<span>{{item.itemcont}}</span>" +
                  "</div>" +
                "</div>" +
              "</div>" +
            "</van-collapse-item>" +
          "</van-collapse>" +
        "</div>" +
      "</div>" +
    "</div>"
    // "<div class='header-cont'>" +
    //   "<div class='aui-pull-left aui-btn' tapmode @click='onBack'>"+
    //       "<span class='aui-iconfont aui-icon-close'></span>"+
    //   "</div>"+
    //   "<div class='aui-title'>{{headertitle}}</div>"+
    //   "<a class='aui-pull-right' @click='onRightMethod' v-if='showright'>"+
    //       "<span>{{righttext}}</span>"+
    //   "</a>"+
    // "</div>"
   });
 }

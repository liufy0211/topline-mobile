import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/*
  这个第三方包引入即可，它会自动根据页面宽度设置网页基准字体大小
*/
import 'amfe-flexible'
/**
 * 现在我们简单粗暴全引进来，方便使用
 */
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
/*
  移动端有好处 会减少代码打包体积
  后面我们再配置为按需引入的方式（有利于打包结果优化）
*/
// import {
//   Button
// } from 'vant'

// Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

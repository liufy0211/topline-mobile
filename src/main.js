import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/*
  这个第三方包引入即可，它会自动根据页面宽度设置网页基准字体大小
*/
import 'amfe-flexible'
// 移动端有好处 会减少代码打包体积
import {
  Button
} from 'vant'

Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

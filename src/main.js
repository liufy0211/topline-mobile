import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidate, { Validator } from 'vee-validate' // 前者是加载默认导出成员，后者是加载按需导入成员
import zhCN from 'vee-validate/dist/locale/zh_CN' // import 加载的东西都是常量
import relativeTime from './filters/relative-time'
/*
  这个第三方包引入即可，它会自动根据页面宽度设置网页基准字体大小
*/
import 'amfe-flexible'
/**
 * 现在我们简单粗暴全引进来，方便使用
 */
import Vant from 'vant'
import 'vant/lib/index.css'

// 注册一个全局过滤器：处理相对时间
Vue.filter('relativeTime', relativeTime)

Vue.use(VeeValidate, {
  events: '' // 禁用默认事件验证
  // events: 'change'
})
Validator.localize('zh_CN', zhCN)
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

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

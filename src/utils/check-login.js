/*
    校验登录状态
*/
import store from '@/store'
import { Dialog } from 'vant'
import router from '@/router'

// checkLogin()
/*
    返回布尔值，表示是否已登录
*/

export default () => {
  const { user } = store.state

  if (user) {
    return true
  }
  // 如果没有登录，则提示 “该操作需要登录”
  Dialog.confirm({
    title: '操作提示',
    message: '该操作需要登录，是否登录？'
  }).then(() => {
    // 如果没有登录，则提示“该操作需要登录”
    // 用户点击确定，跳转到登录页
    // 登录成功，返回之前的页面

    // 写法一
    router.push({
      name: 'login',
      query: { // 传递查询字符串
        //   redirect: '/article/141349'
        // router.currentRoute 用于在非组件模块中获取当前路由对象
        redirect: router.currentRoute.fullPath
      }
    })

    // 写法二
    // router.push('/login?redirect=/article/141349')
    // 登录成功，返回之前的页面

    /*
        我们可以通过$route 拿到当前路由对象
        也可以在js 模块中得到当前路由 js 在哪儿里执行 当前路由就是谁
        组件里可以this.$route
        在非组件中 我们可以通过一个api currentRoute 获取当前的路由信息对象

        非组件中获取当前路由对象router.currentRoute router是我们在路由模块中 new出来的路由实例
    */
  }).catch(() => {
  })
}

// 总结 封装一个js 把它挂载到vue 的原型对象上 js里也可以调用vant组件

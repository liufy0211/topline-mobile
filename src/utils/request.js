import axios from 'axios'
import store from '@/store'

/*
  axios.create 用于创建一个axios实例，该实例和axios的功能是一摸一样的
  说白了就是克隆了一个axios
  为什么要这样做：我们可以拥有多个不同的请求函数，而他们的配置可能是不一样的
  例如有些项目中可能会涉及到使用不同接口路径
    http://toutiao.course.itcast.cn
    http://a.com
    http://b.com
*/
const request = axios.create({
  // baseURL: 'http://toutiao.course.itcast.cn'
  baseURL: 'http://ttapi.research.itcast.cn'
})
// const aRequest = axios.create({
//     baseURL: 'http://a.com'
// })

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent

  // 如果已登录，则为请求接口统一添加用户 token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // return config 是run许请求发送的开关 我们可以在这之前进行一些业务逻辑操作 config本次请求相关的配置对象
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data
  // 如果响应结果对象中有data,则直接返回这个data数据
  // 如果响应结果对象中没有data,则不作任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
// 在哪儿用 在哪儿import  要么把它挂载到Vue 的prototype原型对象中
export default request

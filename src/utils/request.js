import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'

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

/**
 * axios 预留的自定义处理后端返回的原始数据 可以理解成也是一个响应拦截器
 * 这里的data 是后端返回的未经处理的原始数据，如果你要把data转换成js对象 数据就超出了js 安全整数范围了
 * axios 默认使用 JSON.parse 去转换原始数据，如果其中有超出安全整数范围的数据就有问题了
 * 所以我们在这里可以手动处理这个原始数据
 *  npm i json-bigint
 *  JSONbig.parse(原始json格式字符串)
 * 处理后端返回数据中数字超出 JavaScript 安全整数范围
 */
request.defaults.transformResponse = [function (data) {
  // console.log('transformResponse =>', data)
  // return data

  // 这里使用 JSONbig.parse 转换原始数据
  // 类似于 JSON.parse
  // 但是它会处理其中超出安全整数范围的整数问题
  // 严谨一点，如果 不是json 格式字符串就会报错
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]

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

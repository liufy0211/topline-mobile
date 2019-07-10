/*
    用户相关接口封装模块
    最佳实践：建议将所有请求都封装成一个一个小的函数，在需要的时候直接调用
        好处：1好维护，统一管理 2可重用
    遵循一个原则：不要直接在组件中法请求，都封装成函数进行调用
*/

import request from '@/utils/request'

// export const login = (data) => {
//   request({
//     method: 'POST',
//     url: '/app/v1_0/authorizations',
//     data: {
//       mobile: data.mobile,
//       code: data.code
//     }
//   })
// }
// 参数解构 data期望是个对象 发请求的人得 得到request的返回值 调login得得到请求的结果
// export const login = ({ mobile, code }) => {
//     return request({
//       method: 'POST',
//       url: '/app/v1_0/authorizations',
//       data: {
//         mobile,
//         code
//       }
//     })
//   }

export const login = ({ mobile, code }) => request({
  method: 'POST',
  url: '/app/v1_0/authorizations',
  data: {
    mobile,
    code
  }
})
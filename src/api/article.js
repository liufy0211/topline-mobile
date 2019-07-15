/*
    文章相关接口封装模块 仅仅是封装了请求函数 把所有请求封装成一个个函数
*/
import request from '@/utils/request'

/*
    获取推荐频道列表数据
*/
// 代码风格要求不要有带下划线的变量命名 参数解构相当于变量命名
// 定义一个变量叫channelId 值是参数对象里的channelId
// 代码校验 校验的是变量常量之类 不校验对象属性成员
export const getArticles = ({
  channelId, // 频道
  timestamp, // 时间戳（用于分页）
  withTop // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

/*
  对文章不喜欢
*/
export const dislikeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

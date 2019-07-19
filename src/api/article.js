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
// export const dislikeArticle = articleId => {
//   return request({
//     method: 'POST',
//     url: '/app/v1_0/article/dislikes',
//     data: {
//       target: articleId
//     }
//   })
// }

/**
 * 举报文章
 */
export const reportArticle = ({
  articleId,
  type, // 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权'
  remark // 其他问题 的附加说明
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type: Number.parseInt(type),
      remark
    }
  })
}

/*
  获取文章详情
*/

export const getArticleDetail = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

/**
 * 点赞   body 参数
 */
export const likeArticle = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/likings`,
    data: {
      target: articleId
    }
  })
}

/**
 * 取消点赞   路径参数
 */
export const unLikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

/**
 * 对文章不喜欢
 */
export const dislikeArticle = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/dislikes`,
    data: {
      target: articleId
    }
  })
}

/**
 * 取消对文章不喜欢
 */
export const unDislikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}

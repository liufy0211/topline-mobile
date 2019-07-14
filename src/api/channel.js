/*
    频道相关接口封装函数
*/
import request from '@/utils/request'

// 获取首页频道列表
// 已登录：用户频道列表 携带token
// 未登录：推荐频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

/* 获取所有频道列表 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/*
  删除用户指定频道
*/
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}

/**
 *
 * 批量修改用户频道列表（部分覆盖）
 * channels []
 *  { id: 频道id, seq: 频道的序号 }
 * 后端在保存用户频道的时候为每一个频道设置了一个序号，从 1 开始
 * 注意：“推荐”频道不参与序号的排列
 */
export const updateUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

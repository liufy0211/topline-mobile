<template>
    <div>
        chat page
    </div>
</template>

<script>
import io from ''

export default {
  name: 'ChatIndex',
  data () {
    return {
      socket: null
    }
  },
  created () {
    // 1.建立连接
    const socket = io('http://ttapi.research.itcast.cn', {
      // 接口要求建立连接需要提供用户的token
      query: { // 设置第一次建立连接的请求参数
        token: this.$store.state.user.token
      }
    })
    // 备份到当前组件中 为了后续代码使用
    this.socket = socket

    // 建立连接成功调用
    socket.on('connect', function () {
      console.log('建立连接成功了')
      // 它是 socket.emit('message', 数据) 的简写
      // socket.send('hello')

      // 发送消息
      // 参数1：消息的类型（服务端要求的）
      // 参数2：发送的数据（文本数据）
      // 参数3： 发送成功的回调
      socket.emit('messgae', 'hello', function (data) {
        console.log(data)
      })
    })
    // 触发message 事件调用
    // 服务端
    // 监听特定类型的消息
    // 当服务端给我发送一个类型为message 的消息的时候，被触发
    // message 不是乱写的，服务端指定的url地址
    socket.on('message', function (data) {
      console.log(data)
    })
    // 断开连接调用
    socket.on('disconnect', function () {})
  }
}
</script>

<style></style>

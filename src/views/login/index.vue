<template>
  <div class="login-wrap">
    <!-- 头部 -->
    <van-nav-bar title="标题"/>
    <!-- 表单 -->
    <form>
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          right-icon="question-o"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
      <div class="login-btn-box">
        <!-- 不要写行内样式 写行内样式不转rem 要写在style节点上 -->
        <van-button type="info" class="login-btn" @click.prevent="handleLogin">登录</van-button>
      </div>
    </form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        const data = await login(this.user)

        this.$store.commit('setUser', data)
        /*
          这里先简单粗暴的跳转到首页
          真实的业务处理成跳转到之前过来的页面
        */
        this.$router.push({
          name: 'home'
        })
        // console.log(res)
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn-box {
  padding: 20px;
  .login-btn {
    width: 100%;
  }
}

</style>

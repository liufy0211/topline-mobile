<template>
  <div class="login-wrap">
    <!-- 头部 -->
    <van-nav-bar title="标题"/>
    <!-- 表单 -->
    <form>
      <van-cell-group>
        <!-- <div>
          1.使用v-validate配置验证规则
            验证规则参考文档
          2.为元素起个 name （不要重复）
          3.使用errors.first（'元素的name'）获取错误消息
            单个验证规则
          <input v-validate="'required|email'" name="email" type="text">
            多个验证规则使用|分割
          <input v-validate="'required|email'" name="email" type="text">
            或者使用对象配置验证规则
          <input v-validate="{ required: true, email: true }" type="email" name="email">
            显示错误消息
          <span>{{ errors.first('email') }}</span>

          <input type="text" name="fieldName" v-validate.continues="'required|alpha|min:5'">
          <ul>
            <li v-for="error in errors.collect('fieldName')">{{ error }}</li>
          </ul>
        </div> -->
        <van-field
          v-model="user.mobile"
          required
          clearable
          label="手机号"
          right-icon="question-o"
          placeholder="请输入手机号"
          v-validate="'required'"
          name="mobile"
          :error-message="errors.first('mobile')"
        />
        <van-field
          v-model="user.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          v-validate="'required'"
          name="code"
          :error-message="errors.first('code')"
        />
      </van-cell-group>
      <div class="login-btn-box">
        <!-- 不要写行内样式 写行内样式不转rem 要写在style节点上 -->
        <van-button
          type="info"
          class="login-btn"
          loading-text="登录中"
          @click.prevent="handleLogin"
          :loading="loginLoading"
        >登录</van-button>
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
      user: { // 提交登录的表单数据
        mobile: '',
        code: ''
      },
      loginLoading: false, // 控制登录按钮的 loading 状态
      myErrors: {
        mobile: '',
        code: ''
      }
    }
  },
  created () {
    // console.log(this.$route) query 用来获取？什么什么这样的参数 params 用来获取login/: 这种参数
    this.configFormErrorMessage()
  },
  methods: {
    async handleLogin () {
      try {
        // 调用js 触发验证 valid 就是那个参数 这样接收它验证通过的结果与否
        const valid = await this.$validator.validate()
        // 如果校验失败，则停止后续代码执行 valid返回Boolean值
        if (!valid) {
          return
        }
        // 发送请求之前，校验表单数据，校验通过，才进行登录
        // const { mobile, code } = this.user
        // const myErrors = this.myErrors

        // return this.errors.mobile = mobile.length ? '' : '手机号不能为空'
        // return this.errors.code = code.length ? '' : '验证码不能为空'

        // if (mobile.length) {
        //   myErrors.mobile = ''
        // } else {
        //   return myErrors.mobile = '手机号不能为空'
        // }
        // if (code.length) {
        //  myErrors.mobile = ''
        // } else {
        //   return myErrors.code = '验证码不能为空'
        // }

        // 表单验证通过，发送请求，loading 加载
        this.loginLoading = true
        const data = await login(this.user)

        this.$store.commit('setUser', data)
        /*
          这里先简单粗暴的跳转到首页
          真实的业务处理成跳转到之前过来的页面
        */
        // this.$router.push({
        //   name: 'home'
        // })
        // console.log(res)

        // 回到之前的页面
        // 1.简单粗暴的back(),如果是手机app 完全没问题
        // 2.使用url 记住来源路径
        // this.$router.back()
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (err) {
        this.$toast.fail('登录失败')
        console.log(err)
        console.log('登录失败')
      }
      this.loginLoading = false
    },
    configFormErrorMessage () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }
      // 如果需要错误信息提示全局生效
      // Validator.localize('en', dict)
      // or use the instance method
      this.$validator.localize('zh_CN', dict)
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

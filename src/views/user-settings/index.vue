<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="handleSave"
    />
    <van-cell-group>
      <!-- 头像展示图片 value 默认只能显示文本 -->
      <!--
          base64 把文件转换成字符串提交给后端 （正常图片都是个文件 图片能以字符串的方式存在）
       -->
      <van-cell title="头像" is-link>
        <div slot="default" @click="handleSaveFile">
          <!-- default 自定义value 显示内容 -->
          <img width="30" :src="user.photo" alt="">
        </div>
        <!-- 加ref 是为了vue的方式操作这DOM -->
        <!-- input 默认看不见 用来存用户选择图片用的 DOM 元素里有 -->
        <input ref="file" style="display: none;" type="file">
        <!-- <div slot="title"></div> 插槽渲染到title里 默认情况下只能写文本 但是在div里可以写标签 写什么都行 会渲染到标题哪里-->
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user'
export default {
  name: 'UserSettings',
  data () {
    return {
      user: {}
    }
  },

  created () {
    this.loadUser()
  },

  mounted () {
    this.$refs['file'].addEventListener('change', this.handleFileChange)
  },

  methods: {
    handleFileChange () {
      const file = this.$refs['file'].files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.user.photo = reader.result
      })
    },
    async loadUser () {
      try {
        this.user = await getUserProfile()
      } catch (err) {
        this.$toast.fail('加载用户信息失败')
      }
    },
    async handleSave () {
      try {
        const data = await updateUserProfile(this.user)
        this.$toast('更新成功')
        console.log(data)
      } catch (err) {
        this.$toast.fail('更新用户信息失败')
      }
    },
    handleSaveFile () {
      // 手动触发file类型 input的点击事件
      // 接下来要监视它的change 事件 去哪里监视，得操作DOM 了，一上来就得监视 mounted 做初始化的DOM 操作
      this.$refs['file'].click()
    }
  }
}
</script>

<style>
</style>

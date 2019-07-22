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
      <van-cell title="头像" is-link>
        <div slot="default">
          <!-- default 自定义value 显示内容 -->
          <img width="30" :src="user.photo" alt="">
        </div>
        <!-- <div slot="title"></div> 插槽渲染到title里 默认情况下只能写文本 但是在div里可以写标签 写什么都行 会渲染到标题哪里-->
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
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
  methods: {
    async loadUser () {
      try {
        this.user = await getUserProfile()
      } catch (err) {
        this.$toast.fail('加载用户信息失败')
      }
    },
    handleSave () {
    }
  }
}
</script>

<style>
</style>

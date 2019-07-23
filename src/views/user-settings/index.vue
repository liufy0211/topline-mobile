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
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePhoto
} from '@/api/user'
import { Promise } from 'q'
export default {
  name: 'UserSettings',
  data () {
    return {
      user: {}
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
  created () {
    this.loadUser()
  },

  mounted () {
    this.file.addEventListener('change', this.handleFileChange)
  },

  methods: {
    // dase64 上传有一个好处 做预览不需要发送请求纯本地（客户端）就完了，只有在保存数据的时候，才把数据发送给后端。低版本浏览器可能存在兼容问题
    handleFileChange () {
      const file = this.file.files[0]
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
    // 异步串行 有依赖关系 ;a 的执行需要 b 的结果 先等b 执行完了 再执行 a
    // await r1 1
    // await r2 1
    //          2

    // 异步并行
    // r1 1
    // r2 1
    //    1秒
    // 如果需要在几个并发异步任务都执行结束之后做处理，则
    // 使用 Promise.all([异步任务1，异步任务2。。。。]) Promise.all 会等着所有任务都执行完了
    // Promise.all 还是返回 promise 结果是一个数组，数组按照任务的顺序存储每个人物的执行结果
    async handleSave () {
      try {
        // 1.请求上传图片
        const r1 = this.uploadPhoto()

        // 2.请求更新用户信息
        const r2 = updateUserProfile({
          name: this.user.name,
          gender: this.user.gender,
          birthday: this.user.birthday
        })

        await Promise.all([r1, r2])
        this.$toast('更新成功')

        // 要等待以上两个都成功了 才提示它更新成功

        // const data = await updateUserProfile(this.user)
        // this.$toast('更新成功')
        // console.log(data)

        // 上传图片是一个异步请求 更新用户信息也是一个异步请求，这两个异步请求有没有依赖关系 用不用等到图片上传好了再更新用户信息 它俩没有依赖
      } catch (err) {
        this.$toast.fail('更新用户信息失败')
      }
    },
    uploadPhoto () {
      /*
        接口要求 Content-Type 为 multipart/form-data 的处理
      */
      const formData = new FormData()
      // 按照后端接口的要求起的名字photo 值是 this.file.files[0]（文件对象）
      formData.append('photo', this.file.files[0])
      // 把接口返回值return 一下 上面去用
      return updateUserProfilePhoto(formData)
    },

    handleSaveFile () {
      // 手动触发file类型 input的点击事件
      // 接下来要监视它的change 事件 去哪里监视，得操作DOM 了，一上来就得监视 mounted 做初始化的DOM 操作
      this.$refs['file'].click()
    }
  }
}

/**
 *  图片上传的方式 一种是传base64 后端去解析处理
 *                另一种 直接传一个文件对象，不是传字符串，怎么传过去，new 一个 FormData 但不能把它放data 对象里，如果放了还是Content-Type 为 application/json 的数据格式
 * */
</script>

<style>
</style>

<template>
  <div class="write-comment">
    <form action="">
      <input type="text" v-model="content" style="width: 300px">
    </form>
    <div>
      <van-icon name="star-o" />
    </div>
    <div>
      <van-button
        type="default"
        size="small"
        :disabled="!content.length"
        @click="handleAddComment"
      >发布</van-button>
    </div>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'WriteComment',
  /*
    声明接收某个父组件通过 provide 提供的数据
    直接提供给后代取用 不用一级一级往下传了
  */
  inject: ['articleId'],
  props: {
    // 文章或评论的 id
    target: {
      type: [Number, String],
      required: true
    }
    // articleId: {
    //   type: [Number, String],
    //   default: null
    // }
  },
  data () {
    return {
      content: ''
    }
  },
  created () {},
  methods: {
    async handleAddComment () {
      try {
        const data = await addComment({
          target: this.target,
          content: this.content,
          articleId: this.articleId
        })
        // 更新当前的评论列表
        console.log(data)
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.write-comment {
  display: flex;
}
</style>

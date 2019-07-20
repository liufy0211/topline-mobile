<template>
<!--
  a 要加载b 执行b里的代码 b 要来加载a 执行a 里的代码 循环依赖
 -->
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    position="bottom"
    :style="{ height: '95%' }"
    @close="handleClose"
    @open="handleOpen"
  >
  <!-- ref 有两个作用，一个是获取DOM 一个是获取组件 -->
    <comment-list ref="comment-list" :source="commentId" :isArticle="false" />
  </van-popup>
</template>

<script>
import CommentList from './comment-list'
export default {
  name: 'ReplyList',
  components: {
    CommentList
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    commentId: {
      type: [Number, String]
    }
  },
  data () {
    return {}
  },
  created () {},
  // 我们缓存的是 article index.vue ，页面里使用了另一个组件
  // keep-alive 是根级别的路由组件 这个组件跟路由没有关系 缓存指的是切换路由的时候，还保持着它的状态
  // 这个组件 只是显示和隐藏 不涉及到路由的切换
  activated () {
    console.log('activated')
  },
  deactivated () {
    console.log('deactivated')
  },
  methods: {
    handleClose () {
      // this.$refs['comment-list'] 相当于拿到了评论列表组件的this
      // refs 有两个作用
      // 1.获取DOM
      // 2.获取一个组件

      // 最简单粗暴的方式：直接通过 ref 拿到这个组件本身，操作里面的数据得到你想要的结果（相当于父组件直接操作子组件）
      this.$refs['comment-list'].comments = []
      this.$refs['comment-list'].finished = false
      this.$refs['comment-list'].offset = null
    },
    handleOpen () {
      this.$refs['comment-list'].onLoad()
      // this.$refs['comment-list'].loading = true
    }
  }
}
</script>

<style lang="less" scoped></style>

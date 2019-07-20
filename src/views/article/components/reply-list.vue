<template>
<!--
  a 要加载b 执行b里的代码 b 要来加载a 执行a 里的代码 循环依赖
 -->
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    position="bottom"
    :style="{ height: '95%' }"
  >
    <comment-list :source="commentId" :isArticle="false" />
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
  methods: {}
}
</script>

<style lang="less" scoped></style>

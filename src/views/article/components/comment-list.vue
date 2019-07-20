<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in comments"
        :key="item.com_id.toString()"
      >
        <!-- 评论的用户头像 -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt="">
        </div>
        <!-- 评论的用户名称 -->
        <div slot="title">
          <span>{{ item.aut_name }}</span>
        </div>
        <!-- 评论右边赞的按钮 -->
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>赞 {{ item.like_count }}</van-button>
        </div>
        <div slot="label">
          <!-- 评论的内容 -->
          <p>{{ item.content }}</p>
          <p>
            <span>{{ item.pubdate | relativeTime }}</span>
            <span>回复 {{ item.reply_count }}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
export default {
  name: 'CommentList',
  // dataId 可能是评论的id（评论的评论） 也可能是文章的id（用来获取文章的评论）接口是同一个 内容也是一样的
  props: {
    articleId: {
      type: [Number, String]
    },
    commentId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      comments: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  async created () {
    // 不建议直接获取路由id，建议组件保持独立性，跟路由什么也没关系，我们不在这自己获取，让父组件给我 谁用这个组件，谁来给我传这个评论的id
    // console.log(this.$route.params.articleId)
    // 当前文章的 id ?
  },
  methods: {
    async onLoad () {
      const data = await getComments({
        source: this.articleId || this.commentId,
        offset: this.offset,
        limit: this.limit,
        isArticle: !!this.articleId // 获取文章评论？ 还是获取评论的回复
      })
      // console.log(data)
      // 如果数组为空，则表示没有数据了
      if (!data.results.length) {
        this.finished = true
        this.loading = true
        return
      }
      // 如果有数据，添加数据
      this.comments.push(...data.results)
      // 将本次的 loading 设置为 false
      this.loading = false
      // 将本次数据拿到的 last_id 保存起来，用于下一次 onLoad 加载下一页数据
      this.offset = data.last_id
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>

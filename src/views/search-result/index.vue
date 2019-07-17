<template>
  <div class="search-result">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="搜索结果"
      left-text="返回"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 顶部导航 -->

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in articles"
        :key="item.art_id.toString()"
        :title="item.title"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perpage: 10,
      articles: []
    }
  },

  computed: {
    q () {
      return this.$route.params.q
    }
  },

  async created () {
    const data = await getSearch({
      q: this.$route.params.q
    })
    console.log(data)
  },

  methods: {
    async onLoad () {
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
      const data = await this.getSearchResults()
      // 如果请求结果数组为空，则设置List 组件已加载结束
      if (!data.results.length) {
        this.loading = false
        this.finished = true
        return
      }

      // 如果由数据，则将本次加载到的数据 push 到列表数组中
      this.articles.push(...data.results)
      // 数据加载完毕，更新当前页码为下一页，用于下一次加载更多
      this.page += 1
      // 结束当前加载的loading
      // List 列表组件每次onLoad 会自动将 loading 设置为true
      // 如果你不设置的话，它不会触发下一次的onLoad
      this.loading = false
    },
    getSearchResults () {
      // 每次滚动加载 computed里的this.$route.params.q 数据没有变 直接绑定使用this.q了
      return getSearch({
        page: this.page,
        perpage: this.perpage,
        q: this.q
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  .article-list {
    margin-top: 92px;
  }
}
</style>

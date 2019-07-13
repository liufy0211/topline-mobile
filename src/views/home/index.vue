<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar title="首页" fixed/>
    <!-- /头部 -->
    <!-- 频道标签 -->
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
      <van-tab
        :title="channelItem.name"
        v-for="channelItem in channels"
        :key="channelItem.id"
      >
        <!--
          下拉刷新组件
          isLoading 控制下拉的loading状态
          refresh 下拉之后触发的事件
         -->
        <van-pull-refresh
          v-model="channelItem.downPullLoading"
          @refresh="onRefresh"
          :success-text="channelItem.downPullSuccessText"
          :success-duration="1000"
        >
        <!--
          loading 控制加载更多的 loading 状态
          finished 控制是否加载结束
          finished-text="没有更多了" 提示文本
          onLoad 事件会在滚动的底部区域的时候自动调用,每次onLoad它会自动让loading 为true
         -->
        <van-list
          v-model="channelItem.upPullLoading"
          :finished="channelItem.upPullFinished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <!--
          列表中的内容
         -->
          <van-cell
            v-for="articleItem in channelItem.articles"
            :key="articleItem.art_id"
            :title="articleItem.title"
          />
        </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- /频道标签 -->
    <!-- 底部导航 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="my">我的</van-tabbar-item>
    </van-tabbar>
    <!-- /底部导航 -->
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      channels: [] // 存储频道列表
    }
  },
  computed: {
    /*
      当前激活的频道
    */
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  watch: {
    // 监视容器中的user用户
    // 记住：凡是能this. 点儿出来的成员度可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态，如果登录了。则加载用户的频道列表
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为 true，它就会自动去调用 onLoad 请求函数
      this.activeChannel.upPullLoading = true
    }
  },
  created () {
    this.loadChannels()
  },

  methods: {
    async loadChannels () {
      const { user } = this.$store.state
      let channels = []
      // 已登录
      if (user) {
        const data = await getUserChannels()
        channels = data.channels
      } else {
        // 未登录
        // 如果有本地存储数据则使用本地存储中的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有本地存储频道数据则请求获取默认推荐频道列表
          const data = await getUserChannels()
          channels = data.channels
        }
      }
      // 修改channels 将这个数据结构修改为满足我们使用的需求
      channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表 item 是一个一个的频道对象
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载等多的 loading状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channels
    },
    // 上拉加载更多，push 数据
    async onLoad () {
      await this.$sleep(800)

      console.log('onLoad') // 一上来onload 好几次 ，当发现占不满一屏的时候，会再去onload 它自动的
      let data = []
      data = await this.loadArticles()

      // 如果没有 pre_timestamp 并且数组是空的，则意味着没有数据了
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已加载完毕,组件会自动给出提示，并且不再onLoad
        this.activeChannel.upPullFinished = true
        // 取消 loading
        this.activeChannel.upPullLoading = false
        // 代码不要往后继续执行了
        return
      }
      // pre_timestamp 下一页的页码 （下一页的数据，也就是上次时间点推荐的数据）每一次会告诉你上一次推荐数据标志 上一次最新的数据在pre_timestamp
      // results 文章列表
      // console.log(data)

      // 解决初始化的时候没有最新推荐数据的问题 没有最新数据，那就加载上一次推荐数据
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页数据
        data = await this.loadArticles()
      }

      // 数据加载好以后，将 pre_timestamp 更新到当前频道中 用来加载下下页数据
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章数据更新到频道中(注意：是push追加 不是覆盖)
      this.activeChannel.articles.push(...data.results)
      // 数据加载完毕，取消loading
      this.activeChannel.upPullLoading = false
      // console.log(data)

      // 异步更新数据  每onLoad一下 就要加载数据 往list里面 push 数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
        // 所有数据加载完毕，设置 finished 为 true
          this.finished = true
        }
      }, 1000)
    },
    // 下拉刷新，如果有新数据，则是重置列表数据
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        // 由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'

        // 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用onLoad再多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉刷新结束，取消loading 状态
      activeChannel.downPullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp

      // 发请求加载数据，加载完把loading给取消掉
      // setTimeout(() => {
      //   this.pullRefreshLoading = false
      // }, 3000)
    },

    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 默认当前最新时间 下一页数据的时间戳 // Date.now()获取当前时间戳 用于请求分页数据的事件戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    }
  }
}
</script>

<style lang="less" scoped>
.channel-tabs {
  margin-bottom: 100px;
}
// /deep/ 的作用（深度作用选择器）
// 参考文档：https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8
// 注意：你在页面上测量的是设备像素，我们的样式规则转换是基于 75 进行转换的，所以在这里写的时候都 * 2
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
</style>

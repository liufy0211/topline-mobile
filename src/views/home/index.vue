<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar title="首页" fixed/>
    <!-- /头部 -->
    <!-- 频道标签 -->
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
      <!-- 上面是标签栏，下面是具体的标签 -->
      <!-- 这种元素不受作用域影响 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon name="wap-nav"/>
      </div>
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
            :title="articleItem.title">
            <!-- p 标签会作为它的label内容 我们可以在里面写更多的标签定制样式了 -->
            <div slot="label">
              <template v-if="articleItem.cover.type">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in articleItem.cover.images" :key="index">
                    <!-- 图片标签是个组件 不是普通的images 用它的组件有个好处，它能配置懒加载 当滚动到可视区域时 才请求加载图片-->
                    <van-image :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
              </template>
              <p>
                <span>{{ articleItem.aut_name}}</span>
                &nbsp;
                <span>{{ articleItem.comm_count }}</span>
                &nbsp;
                <!-- <span>{{ relativeTime(articleItem.pubdate) }}</span> -->
                <!-- 前面是数据 后面也是个方法 但不是methods 叫做过滤器 -->
                <!--
                  | relativeTime 就是在调用过滤器函数
                  过滤器函数接收的参数就是 | 前面的articleItem.pubdate
                  过滤器函数的返回值会输出到这里
                -->
                <!--
                    过滤器说白了就是函数，在模板中调用函数的另一种方式
                    一般用于格式化输出内容，其中不会有太多业务逻辑，一般都是对字符串的格式化处理
                    过滤器可以定义到：
                      全局：Vue.filter('过滤器名称')，可以在任何组件中使用
                      局部：filters 选项，只能在组件内部使用
                    你给它一种数据 它给你格式化成令一种数据
                  -->
                <span>{{ articleItem.pubdate | relativeTime }}</span>
                </p>
              </div>
                <!-- 这里更多操作的点击按钮 -->
                <!-- 当你点x 的时候把 框弹出来 还要记录起当前你点的这个东西 -->
              <van-icon class="close" name="close" @click="handleShowMoreAction(articleItem)" />
          </van-cell>
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
    <!--频道组件 这是个弹框写到哪儿里都行 在用的时候可以大写也可以小写-->
    <!--
      :value="isChannelShow"
      @input="isChannelShow = $event"
      .sync 修饰符会自动监听一个事件：
      @update:user-channels="channels = $event"
      简单来说，给 props 数组加 .sync 其实就是 v-model 的作用
      只不过一个组件只能有一个 v-model
     -->
     <!-- 属性传值不能写驼峰命名法  activeChannelIndex 首页中高亮的标签索引-->
     <!--  @update-user-channels="channels.push($event)" 通过事件传参 所以要监听一个事件 -->
    <home-channel
      v-model="isChannelShow"
      :user-channels.sync="channels"
      :active-index.sync="activeChannelIndex"
    />
    <!--频道组件 -->

    <!-- 更多操作弹框 -->
    <van-dialog v-model="isMoreActionShow" :showConfirmButton="false">
      <van-cell-group v-if="!toggleRubbish">
        <van-cell title="不感兴趣" @click="handleDislick"/>
        <van-cell title="反馈垃圾内容" is-link @click="toggleRubbish = true" />
        <van-cell title="反馈垃圾内容" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="toggleRubbish = false" />
        <van-cell title="标题夸张" />
        <van-cell title="低速色情" />
        <van-cell title="错别字多" />
        <van-cell title="旧闻重复" />
      </van-cell-group>
    </van-dialog>
    <!-- /更多操作弹框 -->
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import { getUserChannels } from '@/api/channel'
import { getArticles, dislikeArticle } from '@/api/article'
// 加载组件的时候 组件的名不要使用驼峰命名法 要么帕斯卡首字母都大写 要么全小写多个单词用段横杠链接起来
import HomeChannel from './components/channel'
// console.log(dayjs().from(dayjs('2019-7-11 09:15:50'))) // 相对当前时间计算相对时间

export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      channels: [], // 存储频道列表
      isChannelShow: false, // 控制频道面板的显示状态
      isMoreActionShow: false, // 控制更多操作弹框面板
      toggleRubbish: false, // 控制反馈垃圾弹框内容的显示
      currentArticle: null // 存储当前操作更多的文章
    }
  },
  //   | 前面是传参 后面是调filters方法  把|前面数据经过这个函数，处理成另一种表现的方式
  // filters: {
  //   relativeTime (val) {
  //     // console.log(val)
  //     return dayjs().from(dayjs(val))
  //   }
  // },
  computed: {
    /*
      当前激活的频道
    */
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  // 我们可以在组件中监视一些数据，根据数据的改变，执行一些业务逻辑操作
  watch: {
    // 监视容器中的user状态（用户）只要user发生改变，那么就重新获取频道列表
    // 记住：凡是能this. 点儿出来的成员度可以直接在这里监视
    // 由于路由缓存了，所以这里监视用户的登录状态，如果登录了。则加载用户的频道列表
    async '$store.state.user' () {
      console.log('user 改变了')
      // 重新加载用户频道列表
      await this.loadChannels()
      // 由于重新加载了频道数据，所以文章内容也被清空了 而且上拉加载更多的 onLoad没有主动触发
      // 我们这里可以手动触发上拉加载更多的onLoad
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载更多设置为 true，它就会自动去调用 onLoad 请求函数
      // this.activeChannel.upPullLoading = true

      this.activeChannel.upLoading = true
      // 正常的话上面设置 loading 之后，组件会自动去 onLoad
      // 这里它没有自己 onLoad，那我们就自己手动的 onLoad 以下。
      this.onLoad()
    }
  },
  created () {
    // 切换页面 实际上是路由组件改变了 对vue 来说 默认的方式是销毁再重建，也就是它的实例生命周期再走一遍
    console.log('组件重新 created 渲染了')
    // 加载频道列表
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
    },
    handleShowMoreAction (item) {
      // 将点击操作更多的文章存储起来，用于后续使用
      this.currentArticle = item

      // 显示弹框
      this.isMoreActionShow = true
    },
    async handleDislick () {
      // 拿到操作的文章 id
      const articleId = this.currentArticle.art_id.toString()
      // 请求完成操作
      await dislikeArticle(articleId)
      // 隐藏对话框
      this.isMoreActionShow = false
      // 当前频道文章列表
      const articles = this.activeChannel.articles
      // 找到不喜欢的文章位于文章中的索引
      // findIndex 是一个数组方法，它会遍历数组，找到满足 item.art_id === articleId 条件的数据 id
      // 当前元素id 是这个 articleId 嘛？如果是马上返回这个元素对应的索引 如果不是继续遍历
      const delIndex = articles.findIndex(articleItem => articleItem.art_id.toString() === articleId)
      // 把本条数据移除
      articles.splice(delIndex, 1)
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
.channel-tabs .wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  opacity: .7;
}
.close {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>

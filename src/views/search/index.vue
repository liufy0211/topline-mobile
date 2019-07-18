<template>
  <div>
    <form action="/">
      <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action
        @search="handleSearch(searchText)"
      />
    </form>
    <!-- 联想建议列表 -->
    <!-- 当文本框为空时，联想建议列表也不展示了 -->
    <!-- 如果输入框不为零 并且有数据 所以才展示它 -->
    <van-cell-group v-if="suggestions.length && searchText.length">
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="handleSearch(item)"
      >
      <!-- {{}} 无法输出html字符内容 -->
      <!-- v-html 指令才会解析字符串中的html -->
      <!-- <div slot="title">{{ item }}</div> -->
      <!-- 过滤器只能用在{{}} 和v-bind 中 -->
      <div slot="title" v-html="hightlight(item, searchText)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议列表 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon
          v-show="!isDeleteShow"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isDeleteShow=true"
        />
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;" @click="searchHistories = []">全部删除</span>
          <span @click="isDeleteShow = false">完成</span>
        </div>
      </van-cell>
      <van-cell
        v-for="(item, index) in searchHistories"
        :key="item"
        :title="item"
      >
        <van-icon
          v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          @click="searchHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash' // _. 里面有什么成员，我们就声明什么成员
// import _ from 'lodash' 全部加载进来 然后再_.debounce 它里面又很多函数，我们建议按需加载
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 搜索输入的文本
      suggestions: [], // 联想建议
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')), // 所搜历史记录
      isDeleteShow: false
    }
  },
  // 监视它 当它改变就发请求 newVal 当前最新值 oldVal 变化之前的值

  // watch 里 searchText: 这个名字不能随便起 函数名就是你需要监视的数据成员
  watch: {
    // debounce 接收两个参数
    // 第一个参数： 执行你的业务逻辑的参数函数
    // 第二个参数： 防抖时间
    // 当你同一时间调用频率过快，只有挺下来经过指定的时间才会来调用
    // 它每一次都会来调 只是调的时候不够500ms，在500ms以内又触发了这个函数，它就再次延误500ms，直到停下来超过500ms才真的来调
    searchText: debounce(async function (newVal) {
      newVal = newVal.trim() // 去除首位空格

      // 如果数据为空，则什么都不做
      if (!newVal) {
        return
      }
      // 如果数据不为空，则请求联想建议自动补全
      const data = await getSuggestion(newVal)
      // console.log(data)
      this.suggestions = data.options
    }, 500),
    // 由于searchHistories是引用类型 最好用深度监视，当监视到searchHistories改变时，会来调handler
    searchHistories: {
      handler () {
        // 保存搜索历史记录
        window.localStorage.setItem(
          'search-histories',
          JSON.stringify([...new Set(this.searchHistories)])
        )
      },
      deep: true // 建议引用类型数据都配置为深度监视
    }
  },
  decactivated () {
    this.$destroy()
  },
  methods: {
    hightlight (text, keyword) {
      return text.toLowerCase().split(keyword)
        .join(`<span style="color: red">${keyword}</span>`)
    },
    handleSearch (q) {
      // console.log(q)
      if (!q.length) {
        return
      }

      this.searchHistories.unshift(q)

      // 跳转到所搜页面
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })

      /*
        var arr = [1,1,2,2,3,2,1,5]
        new Set(arr)  // {1,2,3,5}
        var s = new Set(arr)
        [...s]
        [1,2,3,5]
      */
    }
  }
}
</script>

<style lang="less" scoped></style>

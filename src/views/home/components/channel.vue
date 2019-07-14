<template>
<!--
    v-model 是：
        v-bind:value="数据"
        v-on：input="数据"="$event"
        lazy-render 关闭懒加载 是否是显示弹层时才渲染节点 默认是true 设置成false 说白了你不弹它 它也渲染出来 提高渲染速度
        get-container="body" 节点渲染到body上
 -->
 <!-- 既然能v-model 它就有个事件叫@input -->
 <!-- 其实就是把  <van-popup/> 的v-model 封装以后移植到<home-channel/>组件上来了 利用外部组件的v-model 控制popup显示与隐藏-->
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    position="bottom"
    get-container="body"
    :lazy-render="false"
    :style="{ height: '95%' }"
  >
  <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
          >编辑</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          text="文字">
          <!-- 选中标签有它的索引 把索引传下来 遍历的时候判断一下，如果当前遍历的index和你激活的标签索引一样 获取高亮的样式 -->
          <span
            class="text"
            :class="{ active: index === activeIndex }"
          >{{ item.name }}</span>
          <!-- <van-icon class="close-icon" name="close" /> -->
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /我的频道 -->

    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
        >
          <div class="info">
            <span class="text">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /推荐频道 -->
  </van-popup>

</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 父传子引用类型这样写
    userChannels: {
      type: Array,
      default: function () {
        return []
      }
      // default: () => [] 或者可以简写
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 组件外部控制这个show
      getAllChannels: []
    }
  },
  // 通过计算属性进行筛选，在这里返回筛选之后的数据
  // 为什么要用计算属性，不管是增加还是删除 操作的是userChannels 相当于穿梭已经实现了，计算属性都能响应它的变化，只要userChannels发生改变，计算属性重新运行重新计算
  computed: {
    /**
     * 该计算属性用于处理获取推荐数据（也就是不包含用户频道列表的其它所有频道列表）
     */
    recommendChannels () {
      // 拿到所有重复的数据 id （把用户的id拿出来）map 遍历数据 map会在内部创建一个新数组 => item.id 表示 return item.id 每遍历一次就往新数组push一个
      // 我提取了一个新的数组 新数组存储了userChannels里每个元素的id
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },

  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        this.allChannels = data.channels
        console.log(data)
      } catch (err) {
        console.loh()
      }
    }
    // handleInput (e) {
    //   console.log('handleInput => s', e)
    //   this.$emit('input', e)
    // }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {}
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>

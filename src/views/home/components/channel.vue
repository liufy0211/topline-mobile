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
          v-for="value in 8"
          :key="value"
          text="文字">
          <div class="info">
            <span class="text">文字</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /推荐频道 -->
  </van-popup>

</template>

<script>
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
    }
  },
  methods: {
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

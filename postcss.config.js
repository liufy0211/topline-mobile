/*
    post-css 是一个后处理器
    说白了就是你 预处理器less sass 处理之后的 css 在进一步处理
    该文件是post-css的配置文件 （post-css 是个工具，也是个插件）
    它有很多插件：
      autoprefixer 用来处理样式兼容前缀用的，你不用写兼容前缀
      postcss-pxtorem 用来将px 转 rem 用的

      375px设备像素宽度
      设计稿一般以物理像素来设计 iphone 宽度750px
  */
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // rem 转换的基准值
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

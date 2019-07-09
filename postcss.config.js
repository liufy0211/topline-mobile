/*
    注意：当前文件是Node.js执行的 只能写Node.js代码
    post-css 是一个后处理器
    说白了就是你 预处理器less sass 处理之后的 css 在进一步处理
    该文件是post-css的配置文件 （post-css 是个工具，也是个插件）
    它有很多插件：
      autoprefixer 用来处理样式兼容前缀用的，你不用写兼容前缀
      postcss-pxtorem 用来将px 转 rem 用的

      375px设备像素宽度
      设计稿一般以物理像素来设计 iphone6 宽度750px进行设计
  */
// rem 转换的基准值
// 这个转换工具：就是把你写的像素除以37.5去转换了
// 关键是大多数移动网页设计稿都是以 iphone6 为原型进行设计，并且使用物理像素750进行设计
// const { sep } = require('path')

/**
 * 如果是 vant 的样式，则基于 37.5 去转（因为 vant 是基于 375 设备像素写的）px 像素
 * 如果是我们自己的，则基于 75 基准值去转换
 * 转换工具以样式文件为单位进行转换的
 * 每一个文件的转换都要调用这个函数，我们可以在这里为不同的文件设置不同的转换规则
 * file：文件信息对象
 *  dirname 也就是当前文件的目录路径
 *
 */
// 每一个样式文件的转换都要经过这个函数

const { sep } = require('path')

module.exports = ({ file }) => {
  // path.sep 用于获取操作系统的路径分隔符
  const rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5 // vant 转换的基准值
    : 75 // 我们的设计稿转换的基准值

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}

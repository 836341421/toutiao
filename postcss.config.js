module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 能够把所有元素的px单位转成Rem
      // rootValue: 转换px的基准值。
      // 例如一个元素宽是75px，则换成rem之后就是2rem。
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

// 基准值: 为什么必须是37.5 (可以修改)
// 但是你要看好, 你再哪个设备宽度作为基准
// 例如: ui给我的设计图都是iphone6, 宽度375
// 为什么flexible除以10, 好计算, 375 / 10 就是你要在上面填写的基准值

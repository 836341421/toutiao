module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 在开发环境development, 使用console不会报错的
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 找到规则名字-去网站找
    // 'no-multiple-empty-lines': 'off' // 自定义规则-关闭连续空行的检验
    'camelcase': 'off'
  }
}

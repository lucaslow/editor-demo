/*babel.config.js  */

const plugins = [
  [
    /* 配置antd-design-vue 按需加载 */
    'import',
    { libraryName: 'ant-design-vue', libraryDirectory: 'lib', style: 'css' }
  ]
]

// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}

module.exports = {
  plugins: plugins,
  presets: ['@vue/cli-plugin-babel/preset']
}

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    //  指定解析器要想使用的环境配置参数
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    /* Eslint自定义规则 */
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0, // 强制在 function的左括号之前使用一致的空格
    'no-const-assign': 2,
    camelcase: 0, // 变量命名默认选用驼峰法
    'vue/use-v-on-exact': ['error']
  }
}

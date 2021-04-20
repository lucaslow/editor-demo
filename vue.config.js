/* vue.config.js */
const webpack = require('webpack')
const path = require('path')
const isPro = process.env.NODE_ENV === 'production'

/* 不需要被打包的第三方库 */
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}

const cdn = {
  /* 开发环境 */
  develop: {
    css: [
      'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.css'
    ],
    js: ['https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.js']
  },
  /* 生产环境 */
  build: {
    css: [
      //   'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue',
      'https://unpkg.com/vue-router/dist/vue-router.js',
      'https://unpkg.com/vuex',
      'https://unpkg.com/axios/dist/axios.min.js'
      //   'https://momentjs.com/downloads/moment.js',
      //   'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.2/dist/antd.min.js'
    ]
  }
}

module.exports = {
  // 部署应用包时的基本 URL, 默认是 '/'
  // 放在子目录时使用./或者加你的域名
  publicPath: process.env.BASE_URL,
  // 构建好的文件打包输出到 output 文件夹下，
  // 结合环境变量可打包出测试和正式两个环境的编译代码包
  outputDir: process.env.outputDir,
  lintOnSave: true, // default false
  productionSourceMap: false, // 打包时不生成.map文件
  configureWebpack: config => {
    if (isPro) {
      /* 配置生产环境 */
      // 加入不需要打包的第三方库
      Object.assign(config, {
        externals: externals
      })
    } else {
      /* 设置开发环境 */
    }
  },
  chainWebpack: config => {
    // 对vue-cli内部的 webpack 配置进行更细粒度的修改 (链式修改)

    // 设置目录别名alias
    config.resolve.alias
      .set('assets', '@/assets')
      .set('components', '@/components')
      .set('views', '@/views')
      .set('styles', '@/styles')
      .set('api', '@/api')
      .set('store', '@/store')
      .set('router', '@/router')
      .set('mock', '@/mock')
      .set('utils', '@/utils')
      .set(
        '@ant-design/icons/lib/dist$',
        path.resolve(__dirname, 'src/utils/antd/icons.js')
      )

    //  去掉打包代码压缩
    // config.optimization.minimize(false)

    // 添加CDN参数到htmlWebpackPlugin配置中
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      return args
    })

    /* 配置moment 只使用中文包，减少Ant-design的打包大小 */
    config
      .plugin('ContextReplacementPlugin')
      .use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])

    /* 代码拆分配置 */
    config.optimization.splitChunks({
      chunks: 'all'
    })
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!isPro,
    sourceMap: false,
    requireModuleExtension: true, // 去掉 .module (css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块
    loaderOptions: {
      sass: {
        /* 优先于其他样式加载（预加载） */
        prependData:
          '@import "styles/mixins.scss";@import "styles/variables.scss";' // 全局引入
      }
    }
  },
  devServer: {
    open: true, // 启动服务后是否打开浏览器
    host: 'localhost',
    port: 8081, // 服务端口
    https: false,
    hotOnly: false, // 关闭热更新
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/test': {
        target: 'http://mdata-api.idealead-test.cluster.gdinsight.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/test': '' } // 重写路径，使 /test 不被传递
      }
    }
  }
}

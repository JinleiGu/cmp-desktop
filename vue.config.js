const path = require('path')
const webpack = require('webpack')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const httpType = 'http://'
const proxyUrl = '10.20.12.12:60005' // 代理地址设置 王瑞：10.10.100.54:8099
module.exports = {
  assetsDir: 'static',
  // 构建时不进行eslint校验
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 生产环境禁止source map
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: httpType + proxyUrl,
        changeOrigin: true
      },
      '/captcha': {
        target: httpType + proxyUrl
      },
      '/app': {
        target: httpType + proxyUrl
      },
      '/messageService': {
        target: 'ws://' + proxyUrl,
        changeOrigin: true,
        ws: true
      },
      '/uploadService': {
        target: 'http://' + proxyUrl,
        changeOrigin: true,
        ws: true
      },
      '/logViewService': {
        target: 'ws://' + proxyUrl,
        changeOrigin: true,
        ws: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('utils', 'cmp-basic/src/utils')
      .set('services', resolve('src/services'))
      .set('util', resolve('src/utils'))
      .set('components', resolve('src/components'))
      .set('component', 'cmp-basic/src/components')
      .set('task', resolve('src/views/task'))
      .set('filters', resolve('src/filters'))
      .set('views', resolve('src/views'))
      .set('public', resolve('public'))
      .set('api', resolve('src/api'))
      .set('store', resolve('src/store'))
      .set('utils', resolve('src/utils'))
  }
}

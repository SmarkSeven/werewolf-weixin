var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: [
    require('autoprefixer')({
      browsers: ['iOS >= 7', 'Android >= 4.1']
    }),
    // require('precss')({ /* options */ }),
    // require('postcss-modules')({
    //   // scopeBehaviour: 'global',
    // }),
  ],
  vue: {
    loaders: {
      scss: ['vue-style-loader','css', 'sass'].join('!')
    }
  },
}

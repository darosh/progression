const { resolve } = require('path')

const DEST = ((argv) => {
  const i = argv.indexOf('--dest')

  if (i > -1) {
    return argv[i + 1]
  } else {
    return 'dist'
  }
})(process.argv)

module.exports = {
  publicPath: './',
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    if (process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD) {
      return
    }

    config
      .plugin('copy-samples')
      .use('copy-webpack-plugin', [
        [{
          to: resolve(DEST) + '/samples/piano/',
          from: '*.mp3',
          context: resolve('./node_modules/tonejs-instruments/samples/piano/'),
          transformPath (p) {
            console.log(p)
            return p
          }
        }]
      ])
  }
}

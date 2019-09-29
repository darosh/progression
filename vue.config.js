const { resolve } = require('path')

const DEST = ((argv) => {
  const i = argv.indexOf('--dest')

  if (i > -1) {
    return argv[i + 1]
  }
})(process.argv)

module.exports = {
  publicPath: './',
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
      .plugin('copy')
      .tap(args => [[args[0][0], {
        ...args[0][0],
        to: (DEST ? resolve(DEST) : args[0][0].to) + '/samples/piano/',
        from: '*.mp3',
        context: resolve('./node_modules/tonejs-instruments/samples/piano/'),
        transformPath (p) {
          console.log(p)
          return p
        }
      }]])
  }
}

const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  // src/index.jsに書いたReactのプログラムを
  entry: path.join(__dirname, 'src/index.js'),
  // public/bundle.jsに出力
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  // 下記記述を書くと'Uncaught ReferenceError: fs is not defined'でスクリプトが動かなくなる
  // target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets:['react','es2015']
          }
      }
    ]
  },
  node: {
    console: false,
    global: true,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
    Buffer: true,
    dns: 'mock',
    fs: 'empty',
    path: true,
    url: false
  },
  externals: ['crypto', 'fs'],
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new webpack.DefinePlugin({ IS_BROWSER: true })
  ]
}

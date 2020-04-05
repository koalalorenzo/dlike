const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    widget: path.resolve(__dirname, 'src/index.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright (c) 2020-2021 Qm64 - [name] [hash] - [file]'
    })
  ],
	module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      }
    ]
  },
  optimization: {
    minimize: true
  },
  performance: {
    hints: false
  }
}
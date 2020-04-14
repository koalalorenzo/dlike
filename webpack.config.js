const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    dlike: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: [ '.jsx', '.js' ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright (c) 2020-2021 Qm64 - [name] [hash] - [file]'
    }),
    new HtmlWebpackPlugin()
  ],
	module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true
  },
  performance: {
    hints: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000,
    bonjour: true,
    host: '0.0.0.0',
    allowedHosts: ["*"],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
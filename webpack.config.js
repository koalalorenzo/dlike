const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    pathinfo: false,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [ '.jsx', '.js' ]
  },
	module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', {
                pragma: 'h',
                pragmaFrag: 'Fragment'
              }]
            ]
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    nodeEnv: 'production',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
  },
  performance: {
    hints: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    lazy: false,
    port: 9000,
    host: '0.0.0.0',
    allowedHosts: ['*'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: { 
    alias: { 
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    }
  }
}

const dlike_widget = Object.assign({}, config, {
  entry: {
    dlike: path.resolve(__dirname, 'src/index.jsx'),
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright (c) 2020-2021 Qm64 - [name] [hash] - [file]'
    }),
  ],
})

const setup_page = Object.assign({}, config, {
  entry: {
    setup: path.resolve(__dirname, 'src/setup.jsx')
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',
    pathinfo: false,
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright (c) 2020-2021 Qm64 - [name] [hash] - [file]'
    }),
    new HtmlWebpackPlugin({
      template: "src/setup.ejs",
      filename: "index.html",
      inject: false,
      meta: {
        charset: { charset: 'utf-8' }
      },
    })
  ],
})

module.exports = [dlike_widget, setup_page] 
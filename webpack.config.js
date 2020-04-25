const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/render.jsx'),
    dlike: path.resolve(__dirname, 'src/component.jsx')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    pathinfo: false
  },
  resolve: {
    extensions: [ '.jsx', '.js' ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Copyright (c) 2020-2021 Qm64 - [name] [hash] - [file]'
    }),
    new HtmlWebpackPlugin({
      template: "index.html"
    })
  ],
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
    splitChunks: true,
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
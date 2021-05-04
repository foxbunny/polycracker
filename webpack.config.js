let path = require('path')
let babelConfig = require('./babel.config')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let { merge } = require('webpack-merge')

let babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: babelConfig,
  },
}

let cssRule = {
  test: /\.css$/i,
  use: ['style-loader', 'css-loader'],
}

let libCommon = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'polycracker',
  },
  module: {
    rules: [
      babelRule,
    ],
  },
}

let libAMD = merge(libCommon, {
  name: 'lib-amd',
  output: {
    filename: 'polycracker.amd.js',
    libraryTarget: 'amd',
  },
  mode: 'production',
})

let libCJS = merge(libCommon, {
  name: 'lib-cjs',
  output: {
    filename: 'polycracker.js',
    libraryTarget: 'commonjs',
  },
  mode: 'production',
})

module.exports = [libAMD, libCJS]

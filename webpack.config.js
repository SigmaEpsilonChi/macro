const path = require('path');
const webpack = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // devtool: 'eval',
  // devtool: "eval-source-map",
  devtool: "inline-source-map",
  entry: {
    index: './app/index.js',
    basics: './app/basics.js',
    crisis: './app/crisis.js',
    challenge: './app/challenge.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: "/dist/",
  },
  /*
  devServer: {
    contentBase: 'dist',
  },
  */
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBuildNotifierPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot-loader', 'babel-loader'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.scss$/,
      loaders: ["style-loader", "css-loader", "sass-loader" ]
    }, {
      test: /\.css$/,
      loaders: ["style-loader", "css-loader"]
    }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json']
  }
};

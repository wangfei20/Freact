
const path = require('path');

const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: [
             //"./utils/loader.js",
             'babel-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins:[
    require('autoprefixer'),
    //require('postcss-modules'),
    require('tailwindcss'),
  ],
  resolve: {
    extensions: ['.js', '.jsx', ".mjs"],
    alias: {
      '@': path.resolve(__dirname), 
      '@freact': path.resolve(__dirname,"../src"), 
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve content from the 'src' directory
    },
    hot: true, // Enable hot module replacement
  },
};
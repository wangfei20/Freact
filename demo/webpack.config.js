const path = require('path');

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
    require('tailwindcss'),
  ],
  resolve: {
    extensions: ['.js', '.jsx', ".mjs"],
    alias: {
      '@': path.resolve(__dirname), 
      'freact': path.resolve(__dirname,"../src"), 
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), 
    },
    hot: true, 
  },
};
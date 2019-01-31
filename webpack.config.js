const path = require('path');
const dest = path.resolve(__dirname, './dist');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: 'store',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  externals: {
    react: 'react',
    'react-dom': 'ReactDOM'
  }
};

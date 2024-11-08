// webpack.config.mjs
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/main.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],  // Ensure Webpack resolves .jsx files as well
  },
  devServer: {
    contentBase: path.resolve('dist'),
    compress: true,
    port: 5173,
  },
  mode: 'development',  // Change to 'production' when building for production
};

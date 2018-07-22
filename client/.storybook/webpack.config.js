const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const baseConfig = require('../webpack.config.base');

const cssLoaderWithModules = {
  loader: 'css-loader',
  options: {
    modules: true,
    camelCase: true,
    importLoaders: 1, // Process @import inside CSS files
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
};

module.exports = Object.assign(baseConfig, {

  resolve: {
    alias: baseConfig.resolve.alias,
    extensions: baseConfig.resolve.extensions,
    modules: [
      'client/app',
      'node_modules',
    ],
  },

  plugins: [
    new MiniCSSExtractPlugin({
      filename: '[name]-[hash].css',
      disable: true, // Set diable to true so that CSS works with hot reloading
    }),
  ],

  module: {
    rules: [
      {
        test: require.resolve('react'),
        use: {
          loader: 'imports-loader',
          options: {
            shim: 'es5-shim/es5-shim',
            sham: 'es5-shim/es5-sham',
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          MiniCSSExtractPlugin.loader,
          // Don't need singleton for hot reload, since we don't expect styles to change
          {
            loader: 'css-loader',
            options: {
              modules: false, // Prevent class renaming
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [ 
          MiniCSSExtractPlugin.loader,
          cssLoaderWithModules,
        ],
      },
      {
        test: /\.(sass|scss)$/,
        include: /node_modules/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: [
          MiniCSSExtractPlugin.loader,
          cssLoaderWithModules,
          'sass-loader',
        ]
      },
      {
        test: /\.ya?ml$/,
        loader: 'yml-loader',
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'images/[hash]-[name].[ext]',
          },
        }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
});

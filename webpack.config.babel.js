/* eslint no-console:"off" */
const {resolve} = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackValidator = require('webpack-validator');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const OfflinePlugin = require('offline-plugin');

module.exports = env => {
  const {ifProd, ifNotProd} = getIfUtils(env);

  const config = webpackValidator({
    context: resolve('src'),

    entry: {
      app: ['./js/application.js'],
      vendor: ['lovefield', 'jquery', 'whatwg-fetch', 'bluebird']
    },

    output: {
      filename: ifProd('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
      path: resolve('dist'),
      pathinfo: ifNotProd()
    },

    devtool: ifProd('source-map', 'eval'),

    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['babel'],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style',
            loader: ['css', 'sass']
          })
        }
      ]
    },

    plugins: removeEmpty([
      new webpack.ProvidePlugin({
        $: 'jquery'
      }),
      new ProgressBarPlugin(),
      new ExtractTextPlugin(ifProd('styles.[name].[chunkhash].css', 'styles.[name].css')),
      ifProd(new InlineManifestWebpackPlugin()),
      ifProd(new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      })),
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true
        },
        inject: 'head'
      }),
      new OfflinePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      })
    ])
  });

  return config;
};

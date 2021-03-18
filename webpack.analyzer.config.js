const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const commonConfig = require('./webpack.config');

commonConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = commonConfig;
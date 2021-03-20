const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV !== 'production';

const banner = '/*! http://wangwl.net */';

let topic_id = isDev ? 'wwl375933ad96869' : '0A945EC1633225F7';

let config = {
    mode: isDev ? 'development' : 'production',
    entry: {
        index: resolve(__dirname, 'src/js/index.js')
    },
    watch: isDev,
    output: {
        clean: true,
        filename: isDev ? '[name][contenthash].js' : '[contenthash].js',
        path: resolve(__dirname, './dist'),
        publicPath: isDev ? "./" : '/static/projects/visualRegex/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? '[name][contenthash].css' : '[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './src/index.html'),
            templateParameters: {topic_id}
        }),
        new webpack.BannerPlugin({
            banner: banner,
            raw: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {drop_console: true}
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    }
}

if (isDev) config.devtool = 'inline-source-map';

module.exports = config;
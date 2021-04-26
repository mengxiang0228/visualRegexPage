const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV !== 'production';

const banner = '/*! https://wangwl.net */';

let topic_id = isDev ? 'wwl375933ad96869' : '0A945EC1633225F7';

const distDir = isDev ? 'dev_dist' : 'dist';

let config = {
    mode: isDev ? 'development' : 'production',
    entry: {
        index: resolve(__dirname, 'src/js/index.js')
    },
    devServer: {
        contentBase: resolve(__dirname, distDir),
        port: 9000,
        open: true,
        openPage: 'index.html',
        writeToDisk: true,
        proxy: {
            '/static/comment': 'http://localhost:80',
            '/static/comment/index.css': 'http://localhost:80',
            '/comment': 'http://localhost:80',
        }
    },
    output: {
        clean: true,
        filename: isDev ? '[name].js' : '[contenthash].js',
        path: resolve(__dirname, distDir),
        publicPath: isDev ? "./" : '/static/projects/visualRegex/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[contenthash].css'
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
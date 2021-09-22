const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const {getLocalIdent} = require('./getLocalIdent');

const isDev = process.env.NODE_ENV !== 'production';

const banner = '/*! https://wangwl.net */';

let topic_id = isDev ? 'wwl375933ad96869' : '0A945EC1633225F7';

const prjDir = path.join(__dirname, '../');
const distDir = isDev ? 'dev_dist' : 'dist';

const cssLoader = {
    loader: 'css-loader',
    options: {
        modules: {
            getLocalIdent: (context, localIdentName, localName, options) => {
                if (isDev) return localName;
                return getLocalIdent(context, localIdentName, localName, options);
            }
        }
    }
}

let config = {
    mode: isDev ? 'development' : 'production',
    entry: {
        index: resolve(prjDir, 'src/js/index.js')
    },
    devServer: {
        contentBase: resolve(prjDir, distDir),
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
        path: resolve(prjDir, distDir),
        publicPath: isDev ? "./" : '/static/projects/visualRegex/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(prjDir, './src/index.html'),
            templateParameters: {topic_id},
            minify: !isDev
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
                use: [MiniCssExtractPlugin.loader, cssLoader, 'less-loader'],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, cssLoader],
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
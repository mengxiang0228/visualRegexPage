const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var isDev = false;

module.exports = {
    mode: isDev?'none':'production',
    entry: {
        app: './src/js/index.js',
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    optimization: {
        minimizer: [
            isDev ? null : new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false,
                        ascii_only: true
                    },
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        properties: true,
                        evaluate: true
                    },
                    warnings: true
                }
            }),
            isDev ? null : new OptimizeCSSAssetsPlugin({})
        ].filter(p => p)
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {minimize: !isDev}},
                    'less-loader'
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {minimize: true}}
                ]
            },
            //npm install --save-dev babel-loader babel-core babel-preset-env
            //npm install --save-dev babel-plugin-transform-runtime
            //npm install --save babel-runtime
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                ["env", {
                                    targets: {"browsers": ["last 2 major versions", "ie >= 9"]},
                                    modules: false
                                }]
                            ],
                            "plugins": [
                                ["transform-runtime", {
                                    "helpers": true,
                                    "polyfill": false,
                                    "regenerator": false,
                                    "moduleName": "babel-runtime"
                                }]
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html',
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                processConditionalComments: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                trimCustomFragments: true
            }
        }),
        new webpack.BannerPlugin('http://wangwl.net')
    ].filter(p => p)

};
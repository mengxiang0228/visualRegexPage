const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

var isDev = false;

module.exports = {

    entry: {
        app: './src/js/index.js',
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    module: {
        rules: [
            // {
            // test: /\.css$/,
            // use: [
            //     {loader: 'style-loader'}, //creates style nodes from JS strings
            //     {loader: 'css-loader'},  //translates CSS into CommonJS
            // ],
            // },
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {loader: 'css-loader', options: {minimize: !isDev}},
                        'less-loader'
                    ],
                    // fallback: ['style-loader'] //不清楚fallback的作用，先注掉
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        {loader: 'css-loader', options: {minimize: true}}
                    ]
                })
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
        new ExtractTextWebpackPlugin({
            filename: 'css/[name].[md5:contenthash:32].css'
        }),
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
        new webpack.BannerPlugin('https://gitee.com/w-wl/')
    ].filter(p => p)

};
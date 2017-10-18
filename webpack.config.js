const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {

    entry: {
        app: './src/js/index.js',
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
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
                    use: ['css-loader', 'less-loader'],
                    // fallback: ['style-loader'] //不清楚fallback的作用，先注掉
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html'
        }),
        new ExtractTextWebpackPlugin({
            filename: 'css/[name].[md5:contenthash:5].css'
        })
    ]

}
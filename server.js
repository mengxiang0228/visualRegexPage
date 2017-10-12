/*
* created by wwl 2017-10-12
* npm install --save-dev :
*   webpack-dev-middleware
*   webpack-hot-middleware
*   express
*   opn
*
* */

const express = require('express');
const webpack = require('webpack');
const opn = require('opn')

//把webpack处理后的文件传递给服务器
const webpackDevMiddleware = require('webpack-dev-middleware');

//热加载
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const config = require('./webpack.config');


config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
])
Object.keys(config.entry).forEach(function (name) {
    config.entry[name] = ['webpack-hot-middleware/client?noInfo=false&reload=true'].concat(config.entry[name])
})


const compiler = webpack(config);

var devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
});

var hotMiddleware = webpackHotMiddleware(compiler, {
    log: () => {
    }
});

// // force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//     compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//         hotMiddleware.publish({ action: 'reload' })
//         cb()
//     })
// })

app.use(devMiddleware);

app.use(hotMiddleware)

var port=3000;

//自动打开页面
devMiddleware.waitUntilValid(() => {
    opn(`http://localhost:${port}/`)
})

app.listen(port, function () {
    console.log('Example app listening on port 3000!\n');
})
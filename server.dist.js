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
const opn = require('opn')

const app = express();
app.use('/', express.static('./dist/'))

var port=3000;


app.listen(port, function () {
    console.log('Example app listening on port 3000!\n');

    //自动打开页面
    opn(`http://localhost:${port}/`)
})
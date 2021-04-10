const {resolve} = require('path');

module.exports = {
    devServer: {
        contentBase: resolve(__dirname, './dist'),
        port: 9000,
        proxy: {
            '/static/comment': 'http://localhost:80',
            '/static/comment/index.css': 'http://localhost:80',
            '/comment': 'http://localhost:80',
        },
    },
}
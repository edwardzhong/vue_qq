const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        index:'index.html',
        port: 3000,
        compress: true,
        historyApiFallback: true,
        hot: true
    }
});
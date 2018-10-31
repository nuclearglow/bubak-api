const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const devConfig = merge(commonConfig, {
    mode: 'development',
    plugins: [
        new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false }),
    ],
    devtool: 'sourcemap',
});

module.exports = devConfig;

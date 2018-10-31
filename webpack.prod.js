const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonConfig = require('./webpack.common');

const prodConfig = merge(commonConfig, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
});

module.exports = prodConfig;

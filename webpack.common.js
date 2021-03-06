const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonConfig = {
    plugins: [
        new CleanWebpackPlugin(['logs/*.log']),
    ],
    entry: path.resolve(path.join(process.cwd(), 'src', 'server.js')),
    output: {
        path: path.resolve(path.join(process.cwd(), 'dist')),
        publicPath: '/',
        filename: 'server.js',
        chunkFilename: '[id].[chunkhash:20].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            }
        ]
    },
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules')
        ]
    },
    stats: {
        // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
        all: undefined,
        // Add asset Information
        assets: true,
        // Sort assets by a field
        // You can reverse the sort with `!field`.
        assetsSort: 'field',
        // Add information about cached (not built) modules
        cached: false,
        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: false,
        // Add children information
        children: false,
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,
        // Add built modules information to chunk information
        chunkModules: false,
        // Add the origins of chunks and chunk merging info
        chunkOrigins: false,
        // Sort the chunks by a field
        // You can reverse the sort with `!field`. Default is `id`.
        // chunksSort: "field",
        // Context directory for request shortening
        // context: "../src/",
        // `webpack --colors` equivalent
        colors: true,
        // Display the distance from the entry point for each module
        depth: false,
        // Display the entry points with the corresponding bundles
        entrypoints: false,
        // Add --env information
        env: false,
        // Add errors
        errors: true,
        // Add details to errors (like resolving log)
        errorDetails: true,
        // Exclude assets from being displayed in stats
        // This can be done with a String, a RegExp, a Function getting the assets name
        // and returning a boolean or an Array of the above.
        // excludeAssets: "filter" | /filter/ | (assetName) => ... return true|false |
        //   ["filter"] | [/filter/] | [(assetName) => ... return true|false],
        // Exclude modules from being displayed in stats
        // This can be done with a String, a RegExp, a Function getting the modules source
        // and returning a boolean or an Array of the above.
        // excludeModules: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // See excludeModules
        // exclude: "filter" | /filter/ | (moduleSource) => ... return true|false |
        //   ["filter"] | [/filter/] | [(moduleSource) => ... return true|false],
        // Add the hash of the compilation
        hash: false,
        // Set the maximum number of modules to be shown
        // maxModules: 15,
        // Add built modules information
        modules: false,
        // Sort the modules by a field
        // You can reverse the sort with `!field`. Default is `id`.
        // modulesSort: "field",
        // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
        moduleTrace: false,
        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: false,
        // Show the exports of the modules
        providedExports: false,
        // Add public path information
        publicPath: true,
        // Add information about the reasons why modules are included
        reasons: false,
        // Add the source code of modules
        source: false,
        // Add timing information
        timings: false,
        // Show which exports of a module are used
        usedExports: false,
        // Add webpack version information
        version: true,
        // Add warnings
        warnings: true
        // Filter warnings to be shown (since webpack 2.4.0),
        // can be a String, Regexp, a function getting the warning and returning a boolean
        // or an Array of a combination of the above. First match wins.
        // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true|false
    },
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    }
};

module.exports = commonConfig;

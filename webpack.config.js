const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    devtool: 'cheap-source-map',
    target: 'node',
    entry: [
        'babel-polyfill',
        path.join(__dirname, 'src/entries/server.js')
    ],
    externals: [nodeExternals()],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            include: [
                path.join(__dirname, 'src')
            ],
            loader: 'babel'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    }
};

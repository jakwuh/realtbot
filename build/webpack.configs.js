import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import {extend} from 'lodash';

const common = ({watch}) => ({
    devtool: 'cheap-source-map',
    watch: watch,
    target: 'node',
    externals: [nodeExternals()],
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    }
});

const server = ({root, watch}) => extend(common({watch}), {
    output: {
        filename: '[name].js'
    }
});

const spec = ({root, watch}) => extend(common({watch}), {
    output: {
        filename: '[name].js'
    }
});

export default {
    server, spec
};

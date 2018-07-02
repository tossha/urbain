const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$':           path.resolve(__dirname, './src/vendor/jquery-3.2.1.min.js'),
            'dat':         path.resolve(__dirname, './src/vendor/dat.gui.js'),
            'Stats':       path.resolve(__dirname, './src/vendor/stats.min.js'),
            'THREE':       path.resolve(__dirname, './src/vendor/three.min.js')
        })
    ],
   // watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};

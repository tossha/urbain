const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.[hash].js"
    },
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(["dist/**/*.*"]),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "public"),
            },
        ], {
            ignore: [
                path.join(__dirname, "public", "index.php"),
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.php"),
            filename: path.join(__dirname, "dist", "index.php"),
            inject: "body",
        }),
    ],
    watchOptions: {
        ignored: /node_modules/
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: 'all'
                }
            }
        }
    },
    performance: {
        hints: false
    }
};

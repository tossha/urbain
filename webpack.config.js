const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.[hash].js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            "THREE":       path.resolve(__dirname, "./src/vendor/three.min.js")
        }),
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
};

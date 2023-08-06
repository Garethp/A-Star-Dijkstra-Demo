const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  mode: "development",
};

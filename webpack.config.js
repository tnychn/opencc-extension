/* eslint-env node */
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: {
    popup: path.resolve(__dirname, "./src/popup/index.js"),
    content: path.resolve(__dirname, "./src/content.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        include: /src\/popup/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      chunks: ["popup"],
      filename: "popup.html",
      template: path.resolve(__dirname, "./src/popup/index.html"),
    }),
  ],
};

module.exports = (_, argv) => {
  const patterns = [
    { from: path.resolve(__dirname, "./src/manifest.json") },
    { from: path.resolve(__dirname, "./src/assets/icon.png") },
  ];
  if (argv.mode === "production") {
    patterns.push({ from: path.resolve(__dirname, "./README.md") });
    patterns.push({ from: path.resolve(__dirname, "./LICENSE.txt") });
  }
  config.plugins.push(new CopyWebpackPlugin({ patterns }));
  return { ...config, devtool: argv.mode === "production" ? false : "source-map" };
};

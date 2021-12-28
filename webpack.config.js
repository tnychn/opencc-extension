/* eslint-env node */
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: {
    background: path.resolve(__dirname, "./src/background.js"),
    content: path.resolve(__dirname, "./src/content.js"),
    popup: path.resolve(__dirname, "./src/popup/index.js"),
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

module.exports = (env, argv) => {
  const patterns = [{ from: path.resolve(__dirname, "./src/assets/icon.png") }];
  env.BROWSER === "chrome" &&
    patterns.push({
      from: path.resolve(__dirname, "./src/manifest.chrome.json"),
      to: "manifest.json",
    });
  env.BROWSER === "firefox" &&
    patterns.push({
      from: path.resolve(__dirname, "./src/manifest.firefox.json"),
      to: "manifest.json",
    });
  argv.mode === "production" && patterns.push({ from: path.resolve(__dirname, "./LICENSE.txt") });
  config.plugins.push(new CopyWebpackPlugin({ patterns }));
  return { ...config, devtool: argv.mode === "production" ? false : "source-map" };
};

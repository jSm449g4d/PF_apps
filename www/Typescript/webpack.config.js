const path = require("path");
const entry = require("webpack-glob-entry");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: entry("./tsx/*.tsx"),
  output: {
    path: path.resolve(__dirname, "../"),
    filename: "./static/src/[name].js",
  },

  mode: "production",
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx"],
  },

  module: {
    rules: [
      { exclude: /node_modules/, test: /\.ts(x?)$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },

  plugins: [new CopyPlugin([{ from: "./www/**/*", to: "../" }])],

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "firebase/app": "firebase",
    "firebase/analytics": "firebase",
    "firebase/auth": "firebase",
    "firebase/storage": "firebase",
    "firebase/firestore": "firebase",
  },
};

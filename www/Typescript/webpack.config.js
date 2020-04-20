const path = require("path");
const entry = require("webpack-glob-entry");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
//  entry: entry("./tsx/*.tsx"),
  entry: entry("./tsx/main.tsx"),
  output: {
    path: path.resolve(__dirname, "../"),
//    filename: "./html/static/src/[name].js",
    filename: "./html/static/src/app_tsx.js",
  },

  mode: "production",
  devtool: "source-map",

  resolve: {
    extensions: [".js",".ts", ".tsx"],
  },

  module: {
    rules: [
      { exclude: /node_modules/, test: /\.ts(x?)$/, loader: "ts-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },

  plugins: [new CopyPlugin([{ from: "./html/**/*", to: "./" }])],

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "firebase/app": "firebase",
    "firebase/analytics": "firebase",
    "firebase/auth": "firebase",
    "firebase/storage": "firebase",
    "firebase/firestore": "firebase",
  },
};

const path = require("path");
const entry = require("webpack-glob-entry");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: entry("./*.tsx"),
  output: {
    path: path.resolve(__dirname, "../../"),
    filename: "./www/static/src/[name].js",
  },

  mode: "production",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts(x?)$/,
        loader: "ts-loader",
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new CopyPlugin([
      {
        from: "./www/**/*",
        to: "./",
      }
    ]),
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
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

const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line import/no-extraneous-dependencies
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: "none",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: { node: "8.10" } }]]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".build"),
    filename: "[name].js"
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: {
            keep_fnames: true //Does not optimize function names
          },
          compress: {
            keep_fnames: true //Same as mangle. Both are necessary
          }
        }
      })
    ]
  }
};

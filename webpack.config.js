const path = require("path");
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
          // "imports-loader?graphql",
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
      },
      // {
      //   test: /\.(graphql|gql)$/,
      //   exclude: /node_modules/,
      //   loader: "graphql-tag/loader"
      // }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".build"),
    filename: "[name].js"
  }
};

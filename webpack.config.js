const path = require("path"); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/client/js/main.js",
  plugins: [new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }
  )],
  mode: "development",
  watch: true,
  output: {
    filename: "xxxx/js/main.js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use : [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ]
      }
    ]
  }
};
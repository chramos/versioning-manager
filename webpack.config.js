const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".js"],
    fallback: {
      fs: false,
      assert: false,
    },
  },
};

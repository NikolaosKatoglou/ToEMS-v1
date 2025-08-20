const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true), // if you use Options API
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // disables devtools in prod
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // disables that warning
      }),
    ],
  },
});

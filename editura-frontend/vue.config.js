const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true, // Activează API-ul opțiunilor
        __VUE_PROD_DEVTOOLS__: false, // Dezactivează DevTools în producție
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // Dezactivează erorile de hidratare suplimentare
      }),
    ],
  },
});

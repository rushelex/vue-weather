module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/vue-weather/" : "/",
  productionSourceMap: false,
  css: {
    sourceMap: true
  },
  configureWebpack: {
    devtool: "source-map"
  }
};

import webpackMiddleware from 'koa-webpack';

export default (app) => {
  app.use(webpackMiddleware({ dev: {
    publicPath: '/assets/',
    lazy: false,
  } }));
};

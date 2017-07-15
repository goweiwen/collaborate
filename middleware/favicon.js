import favicon from 'koa-favicon';

export default (app) => {
  app.use(favicon(`${__dirname}/../public/assets/favicon.ico`));
};

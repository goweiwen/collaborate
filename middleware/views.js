import views from 'koa-views';
import path from 'path';

export default (app) => {
  app.use(views(path.join(__dirname, '../views'), { extension: 'pug' }));
};

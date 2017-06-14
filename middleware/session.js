import session from 'koa-session';
import store from './store';

export default (app) => {
  app.use(session({ store }, app));
  return store;
};

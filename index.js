/* eslint-disable no-console */

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import multer from './middleware/multer';
import passport from './middleware/passport';
import s3 from './middleware/s3';
import session from './middleware/session';
import staticServer from './middleware/staticServer';
import webpack from './middleware/webpack';
import views from './middleware/views';
import start from './app';
import favicon from './middleware/favicon';

const app = new Koa();
const router = new Router();

// Session secret
app.keys = ['wNxB5QD5W_x5CfbhNjvaVMJ-'];


app.use(logger());
session(app);
favicon(app);
app.use(bodyParser());
multer(router);
passport(app, router);
s3(app, router);
webpack(app);
views(app);
staticServer(app, router);

router
  // .get('/', ctx => ctx.redirect('/default'))
  .get('/', (ctx) => {
    ctx.state.room = 'default';
    return ctx.render('./index.pug');
  })
  .get('/:room', (ctx) => {
    if (!ctx.isAuthenticated()) {
      ctx.session.redirectTo = ctx.req.url;
      return ctx.redirect('/login');
    }
    ctx.state.room = ctx.params.room;
    return ctx.render('./rooms.pug');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => { if (err) console.log(err); });
start(server);
console.log(`Listening on port ${port}`);


/* eslint-disable no-console */

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import logger from 'koa-logger';
import multer from './middleware/multer';
import passport from './middleware/passport';
import staticServer from './middleware/staticServer';
import webpack from './middleware/webpack';
import start from './app';

const app = new Koa();
const router = new Router();

// Session secret
app.keys = ['wNxB5QD5W_x5CfbhNjvaVMJ-'];

app
  .use(logger())
  .use(session({}, app))
  .use(bodyParser());

multer(router);
passport(app, router);
webpack(app);
staticServer(app, router);

const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => { if (err) console.log(err); });
start(server);
console.log(`Listening on port ${port}`);


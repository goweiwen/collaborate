/* eslint-disable import/first */
/* eslint-disable no-console */

import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

// Upload endpoint
import multer from 'koa-multer';

const upload = multer({ dest: 'public/uploads/' });
router.post('/upload', upload.single('file'), (ctx, next) => {
  const { filename, originalname } = ctx.req.file;
  ctx.body = { filename, originalname };
  return next();
});

// Logger
import logger from 'koa-logger';

app.use(logger());

// Sessions
import session from 'koa-session';

app.keys = ['wNxB5QD5W_x5CfbhNjvaVMJ-'];
app.use(session({}, app));

// Body Parser
import bodyParser from 'koa-bodyparser';

app.use(bodyParser());

// Authentication
import passport from 'koa-passport';

app.use(passport.initialize());
app.use(passport.session());

import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

const GOOGLE_CLIENT_ID = '988996499797-tuq14tf6r4gh6hsghjop99o3is6nlt13.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'wNxB5QD5W_x5CfbhNjvaVMJ-';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/login/callback',
}, (accessToken, refreshToken, profile, done) => done(null, profile.email)));

router.get('/login', passport.authenticate('google', {
  scope: ['email'],
}));

router.get('/login/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Webpack
import webpackMiddleware from 'koa-webpack';

app.use(webpackMiddleware({ dev: {
  publicPath: '/assets/',
  lazy: false,
} }));

// Static server
import serve from 'koa-static-server';

const staticServer = serve({ rootDir: 'public' });

// Router
router.get('/*', (ctx) => {
  if (ctx.isAuthenticated()) {
    return staticServer(ctx);
  }
  return ctx.redirect('/login');
});
app.use(router.routes());

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => { if (err) console.log(err); });
console.log(`Listening on port ${port}`);

// Redux
const state = {
  tiles: [
    { id: 0, tileType: 'pdf', page: 0, src: 'uploads/The C Programming Language - 2nd Edition - Kernighan & Ritchie.pdf' },
    { id: 1, tileType: 'image', src: 'https://unsplash.it/200/300' },
    { id: 2, tileType: 'text', content: '2' },
    { id: 3, tileType: 'youtube', src: 'HtSuA80QTyo' },
    { id: 4, tileType: 'googledoc', src: 'https://docs.google.com/document/d/1Xf0bxn-cvB18ycAxP27bDqeYAYq_JqKY6psZoPJuT-E/edit?usp=sharing' },
  ],
  layouts: {
    0: { x: 0, y: 0, width: 300, height: 450, lockAspectRatio: true },
    1: { x: 300, y: 0, width: 300, height: 450, lockAspectRatio: true },
    2: { x: 600, y: 0, width: 300, height: 300, lockAspectRatio: false },
    3: { x: 0, y: 450, width: 300, height: 300, lockAspectRatio: false },
    4: { x: 300, y: 450, width: 300, height: 300, lockAspectRatio: false },
  },
};

import reduxLogger from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { addTile, removeTile, addChatMessage, updateTile, updateLayout } from './actions';
import reducer from './reducers/server';
import { ADD_TILE, UPDATE_TILE, REMOVE_TILE, INITIALISE_LAYOUTS, UPDATE_LAYOUT, ADD_CHAT_MESSAGE } from './actions';

const store = createStore(
  reducer,
  state,
  applyMiddleware(reduxLogger),
);

// Socket.io
import socketio from 'socket.io';

const io = socketio(server);
io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit(INITIALISE_LAYOUTS, store.getState().layouts);
  socket.emit('initialise tiles', store.getState().tiles);
  socket.emit('initialise chat', store.getState().messages);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on(ADD_TILE, (tile, id) => {
    store.dispatch(addTile(tile, id));
    socket.broadcast.emit(ADD_TILE, tile, id);
  });

  socket.on(REMOVE_TILE, (id) => {
    store.dispatch(removeTile(id));
    store.dispatch(updateLayout(undefined, id));
    socket.broadcast.emit(REMOVE_TILE, id);
  });

  socket.on(UPDATE_TILE, (tile) => {
    store.dispatch(updateTile(tile));
    socket.broadcast.emit(UPDATE_TILE, tile);
  });

  socket.on(UPDATE_LAYOUT, (layout, id) => {
    store.dispatch(updateLayout(layout, id));
    socket.broadcast.emit(UPDATE_LAYOUT, layout, id);
  });

  socket.on(ADD_CHAT_MESSAGE, (message) => {
    store.dispatch(addChatMessage(message));
    socket.broadcast.emit(ADD_CHAT_MESSAGE, message);
  });
});

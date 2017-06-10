import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

// Upload endpoint
import multer from 'koa-multer';
const upload = multer({ dest: 'public/uploads/' });
router.post('/upload', upload.single('file'), async (ctx, next) => {
  const { filename, originalname } = ctx.req.file;
  ctx.body = { filename, originalname };
  return await next();
});

// Logger
import logger from 'koa-logger';
app.use(logger());

// Sessions
import session from 'koa-session';
app.keys = [ 'wNxB5QD5W_x5CfbhNjvaVMJ-' ];
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
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile.email);
}));

router.get('/login', passport.authenticate('google', {
  scope: [ 'email' ]
}));

router.get('/login/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// CORS
import cors from 'kcors';
app.use(cors());

// Webpack
import webpackMiddleware from 'koa-webpack';
app.use(webpackMiddleware({ dev: {
  'publicPath': '/assets/',
  'lazy': false
} }));

// Static server
import serve from 'koa-static-server';
const staticServer = serve({ rootDir: 'public' });

// Router
router.get('/*', async (ctx) => {
  if (ctx.isAuthenticated()) {
    return await staticServer(ctx);
  } else {
    ctx.redirect('/login');
  }
});
app.use(router.routes());

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, (err) => { if (err) console.log(err); });
console.log(`Listening on port ${port}`);

// Redux
let state = {
  tiles: [
    { id: 0, tileType: 'text', content: '0' },
    { id: 1, tileType: 'text', content: '1' },
    { id: 2, tileType: 'pdf', page: 0,
      src: 'uploads/The C Programming Language - 2nd Edition - Kernighan & Ritchie.pdf' },
    { id: 3, tileType: 'youtube', src: 'HtSuA80QTyo' },
    { id: 4, tileType: 'googledoc',
      src: 'https://docs.google.com/document/d/1Xf0bxn-cvB18ycAxP27bDqeYAYq_JqKY6psZoPJuT-E/edit?usp=sharing' }
  ],
  layouts: {
    0: { x:0, y:0, width:300, height:300 },
    1: { x:300, y:0, width:300, height:300 },
    2: { x:600, y:0, width:300, height:300 },
    3: { x:0, y:300, width:300, height:300 },
    4: { x:300, y:300, width:300, height:300 }
  }
};

import reduxLogger from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { addTile, removeTile, addChatMessage, updateTile, updateLayout } from './actions';
import reducer from './reducers/server';

const store = createStore(
  reducer,
  state,
  applyMiddleware(reduxLogger)
);

// Socket.io
import socketio from 'socket.io';
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('initiliase layouts', store.getState().layouts);
  socket.emit('initialise tiles', store.getState().tiles);
  socket.emit('initialise chat', store.getState().messages);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('add', (tile, id) => {
    store.dispatch(addTile(tile, id));
    socket.broadcast.emit('add', tile, id);
  });

  socket.on('remove', (id) => {
    store.dispatch(removeTile(id));
    store.dispatch(updateLayout(undefined, id));
    socket.broadcast.emit('remove', id);
  });

  socket.on('update tile', (tile)=> {
    store.dispatch(updateTile(tile));
    socket.broadcast.emit('update tile', tile);
  });

  socket.on('update layout', (layout, id) => {
    store.dispatch(updateLayout(layout, id));
    socket.broadcast.emit('update layout', layout, id);
  });

  socket.on('add chat message', (message) => {
    store.dispatch(addChatMessage(message));
    socket.broadcast.emit('add chat message', message);
  });
});

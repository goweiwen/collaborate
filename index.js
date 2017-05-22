import Koa from 'koa';
import Router from 'koa-router';
import multer from 'koa-multer';
import serve from 'koa-static-server';
import socketio from 'socket.io';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import webpackMiddleware from 'koa-webpack';
import { addTile, removeTile, addChatMessage, updateTile } from './actions';
import reducer from './reducers/server';

const PORT = 3000;
const app = new Koa();
const router = new Router();

// Upload endpoint
const upload = multer({ dest: 'public/uploads/' });

// Routes
router
  .post('/upload', upload.single('file'), async (ctx, next) => {
    const { filename, originalname } = ctx.req.file;
    ctx.body = { filename, originalname }
    return await next();
  })
  .get('/*', serve({ rootDir: 'public' }));

app
  .use(webpackMiddleware({ dev: {
    'publicPath': '/assets/',
    'lazy': false
  } }))
  .use(router.routes());


const server = app.listen(PORT, (err) => { if (err) console.log(err); });
console.log('Listening on port 3000');

// Redux
let state = {
  messages: [
    {id:0, user:'Admin', text:'Welcome'},
    {id:1, user:'Nicholas', text:'World'}
  ],

  tiles: [
    
    {id: 0, tile: 'youtube', src: 'HtSuA80QTyo',
     layout: {x:0, y:0, width:300, height:300}
    },
    
    {id: 1, tile: 'image', src: 'https://unsplash.it/200/300?image=1',
     layout: {x:0, y:0, width:300, height:300}
    },
    
    {id: 2, tile: 'text', content: 'hi',
     layout: {x:0, y:0, width:300, height:300}
    },
  ],
};

const store = createStore(
  reducer,
  state,
  applyMiddleware(logger)
);

// Socket.io
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('initialise', store.getState().tiles);
  socket.emit('initialise chat', store.getState().messages);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('add', (tile) => {
    store.dispatch(addTile(tile));
    socket.broadcast.emit('add', tile);
  });

  socket.on('remove', (id) => {
    store.dispatch(removeTile(id));
    socket.broadcast.emit('remove', id);
  });

  socket.on('update tile', (tile)=> {
    store.dispatch(updateTile(tile));
    socket.broadcast.emit('update tile', tile);    
  });


  socket.on('add chat message', (message) => {
      store.dispatch(addChatMessage(message));
      socket.broadcast.emit('add chat message', message);
    });
});

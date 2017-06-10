import Koa from 'koa';
import Router from 'koa-router';
import multer from 'koa-multer';
import serve from 'koa-static-server';
import cors from 'kcors';
import socketio from 'socket.io';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import webpackMiddleware from 'koa-webpack';
import { addTile, removeTile, addChatMessage, updateTile, updateLayout } from './actions';
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
    ctx.body = { filename, originalname };
    return await next();
  })
  .get('/*', serve({ rootDir: 'public' }));

app
  .use(cors())
  .use(webpackMiddleware({ dev: {
    'publicPath': '/assets/',
    'lazy': false
  } }))
  .use(router.routes());

     // Start server
const server = app.listen(PORT, (err) => { if (err) console.log(err); });
console.log('Listening on port 3000');

// Redux
let state = {
  
  tiles: [
    {id: 0, tileType: 'pdf', page: 0, src: 'uploads/Tutorial1.pdf',}, 
    {id: 1, tileType: 'image', src: 'https://unsplash.it/200/300',}, 
    {id: 2, tileType: 'text', content: '2',},
    {id: 3, tileType: 'youtube', src: 'HtSuA80QTyo',},
    {id: 4, tileType: 'googledoc', src: 'https://docs.google.com/document/d/1Xf0bxn-cvB18ycAxP27bDqeYAYq_JqKY6psZoPJuT-E/edit?usp=sharing',}  
  ],

  layouts: {
    0: {x:0, y:0, width:300, height:450, lockAspectRatio: true,},
    1: {x:300, y:0, width:300, height:450, lockAspectRatio: true,},
    2: {x:600, y:0, width:300, height:300, lockAspectRatio: false,},
    3: {x:0, y:450, width:300, height:300, lockAspectRatio: false,},
    4: {x:300, y:450, width:300, height:300, lockAspectRatio: false,},
  },
};


/* 

messages: [
    {id:0, user:'Admin', text:'Welcome'},
    {id:1, user:'Nicholas', text:'World'}
=======
  messages: [
    { id: 0, user: 'Admin', text: 'Welcome' },
    { id: 1, user: 'Nicholas', text: 'World' }
>>>>>>> 90438733e00ce8a18b9be7a1d8026b85366c10f2
  ],


tiles: [
    {
      id: 0, tileType: 'youtube', src: 'HtSuA80QTyo',
      layout: { x: 0, y: 0, width: 300, height: 300 }
    },
    {
<<<<<<< HEAD
      id: 1, tileType: 'image', src: 'https://unsplash.it/200/300?image=1',
      layout: {x:300, y:0, width:300, height:300}
=======
      id: 1, tileType: 'image', src: 'https://unsplash.it/200/300',
      layout: { x: 310, y: 0, width: 300, height: 300 }
>>>>>>> 90438733e00ce8a18b9be7a1d8026b85366c10f2
    },
    {
      id: 2, tileType: 'text', content: 'hi',
<<<<<<< HEAD
      layout: {x:600, y:0, width:300, height:300},
    }, 

    {
      id: 3, tileType: 'pdf', page: 0,
      src: 'http://www.comp.nus.edu.sg/~cs2100/lect/cs2100-1-intro.pdf',
      layout: {x:0, y:300, width:300, height:300}
=======
      layout: { x: 0, y: 310, width: 300, height: 300 },
    },
    {
      id: 3, tileType: 'pdf', page: 0,
      src: 'uploads/The C Programming Language - 2nd Edition - Kernighan & Ritchie.pdf',
      layout: { x: 310, y: 310, width: 300, height: 300 }
>>>>>>> 90438733e00ce8a18b9be7a1d8026b85366c10f2
    },

     {
      id: 4, tileType: 'pdf', page: 0,
      src: 'uploads/Tutorial1.pdf',
      layout: {x:300, y:300, width:300, height:300}
    },

    {
      id: 5, tileType: 'pdf', page: 0,
      src: 'http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf',
      layout: {x:600, y:300, width:300, height:300}
    },
  ]*/

const store = createStore(
  reducer,
  state,
  applyMiddleware(logger)
);

// Socket.io
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user connected');
  //console.log(store.getState().layouts)
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

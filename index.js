import Koa from 'koa';
import serve from 'koa-static-server';
import socketio from 'socket.io';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { addTile, removeTile } from './actions';
import reducer from './reducers';

const PORT = 3000;
const app = new Koa();

app.use(serve({ rootDir: 'dist' }));

const server = app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
});

console.log('Listening on port 3000');

let state = {
  tiles: [
    {id: 0, tile: 'text', content: 'hi'},
    {id: 1, tile: 'image', src: 'http://source.unsplash.com/random/1'},
    {id: 2, tile: 'text', content: 'hi'},
  ]
}

const store = createStore(
  reducer,
  state,
  applyMiddleware(logger)
);

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('initialise', store.getState().tiles);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('add', (tile) => {
    store.dispatch(addTile(tile));
    console.log('add', tile);
  });

  socket.on('remove', (id) => {
    store.dispatch(removeTile(id));
    console.log('remove', id);
  });
});

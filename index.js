import Koa from 'koa';
import serve from 'koa-static-server';
import socketio from 'socket.io';

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

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.emit('initialise', state.tiles);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('add', (tile) => {
    console.log('add', tile);
  });

  socket.on('remove', (id) => {
    console.log('remove', id);
  });
});

/* eslint-disable no-console */

import socketio from 'socket.io';
import cookie from 'cookie';
import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers/server';
import db from './db';
import {
  addTile, updateTile, removeTile, addChatMessage, updateLayout, updateAnnotation, userJoined, userLeft, userMoved,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, UPDATE_ANNOTATION, USER_JOINED, USER_LEFT, USER_MOVED,
} from './actions';
import sessionStore from './middleware/store';

const stores = {};

const persist = room => store => next => (action) => {
  next(action);
  db.set(`redux-${room}`, JSON.stringify(store.getState()));
};

function prepareRoom(room, callback) {
  if (room in stores) {
    callback(stores[room]);
    return;
  }
  db.get(`redux-${room}`, (err, initialState) => {
    const state = initialState ? JSON.parse(initialState) : {};
    state.users = {};
    const store = createStore(
      reducer,
      state,
      applyMiddleware(persist(room)),
    );
    stores[room] = store;
    callback(store);
  });
}

export default (server) => {
  const io = socketio(server);

  io.set('authorization', async (data, accept) => {
    const sid = cookie.parse(data.headers.cookie)['koa:sess'];
    const session = await sessionStore.get(sid);
    if (session) {
      // eslint-disable-next-line no-param-reassign
      data.user = session.passport.user;
      accept(null, true);
    } else {
      console.log('Authentication error.');
    }
  });

  io.on('connection', (socket) => {
    const room = socket.handshake.query.room;

    prepareRoom(room, (store) => {
      console.log(`${socket.request.user.user} joined '${room}'`);

      const { layouts, tiles, messages, annotation, users } = store.getState();
      socket.emit('initialise', { layouts, tiles, messages, annotation, users });

      store.dispatch(userJoined(socket.request.user));
      socket.broadcast.to(room).emit(USER_JOINED, socket.request.user);

      socket.join(room);

      socket.on('disconnect', () => {
        console.log(`${socket.request.user.user} left '${room}'`);
        store.dispatch(userLeft(socket.request.user));
        socket.broadcast.to(room).emit(USER_LEFT, socket.request.user);
      });

      socket.on('drawing', (x0, y0, x1, y1, tool, erase) => {
        socket.broadcast.to(room).emit('drawing', x0, y0, x1, y1, tool, erase);
      });

      socket.on('clear', () => {
        socket.broadcast.to(room).emit('clear');
      });

      socket.on(ADD_TILE, (tile, id) => {
        store.dispatch(addTile(tile, id));
        socket.broadcast.to(room).emit(ADD_TILE, tile, id);
      });

      socket.on(REMOVE_TILE, (id) => {
        store.dispatch(removeTile(id));
        store.dispatch(updateLayout(undefined, id));
        socket.broadcast.to(room).emit(REMOVE_TILE, id);
      });

      socket.on(UPDATE_TILE, (tile) => {
        store.dispatch(updateTile(tile));
        socket.broadcast.to(room).emit(UPDATE_TILE, tile);
      });

      socket.on(UPDATE_LAYOUT, (layout, id) => {
        store.dispatch(updateLayout(layout, id));
        socket.broadcast.to(room).emit(UPDATE_LAYOUT, layout, id);
      });

      socket.on(ADD_CHAT_MESSAGE, (message) => {
        store.dispatch(addChatMessage(message));
        socket.broadcast.to(room).emit(ADD_CHAT_MESSAGE, message);
      });

      socket.on(UPDATE_ANNOTATION, (dataURL) => {
        store.dispatch(updateAnnotation(dataURL));
        /* socket.broadcast.emit(UPDATE_ANNOTATION, dataURL);*/
      });

      socket.on(USER_MOVED, ({ user, x, y }) => {
        store.dispatch(userMoved({ user, x, y }));
        socket.broadcast.to(room).emit(USER_MOVED, { user, x, y });
      });
    });
  });

  return io;
};

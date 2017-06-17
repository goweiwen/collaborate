/* eslint-disable no-console */

import socketio from 'socket.io';
import cookie from 'cookie';
import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncNodeStorage } from 'redux-persist-node-storage';
import reduxLogger from 'redux-logger';
import reducer from './reducers/server';
import {
  addTile, updateTile, removeTile, addChatMessage, updateLayout,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, INITIALISE_LAYOUTS,
} from './actions';
import sessionStore from './middleware/store';

const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(reduxLogger),
    autoRehydrate(),
  ),
);
persistStore(store, { storage: new AsyncNodeStorage('./scratch') });

export default (server) => {
  const io = socketio(server);

  io.set('authorization', async (data, accept) => {
    const sid = cookie.parse(data.headers.cookie)['koa:sess'];
    const session = await sessionStore.get(sid);
    if (session) {
      // eslint-disable-next-line no-param-reassign
      data.name = session.passport.user;
      accept(null, true);
    } else {
      console.log('Authentication error.');
    }
  });

  io.on('connection', (socket) => {
    console.log(`${socket.request.name} connected`);
    socket.emit(INITIALISE_LAYOUTS, store.getState().layouts);
    socket.emit('initialise tiles', store.getState().tiles);
    socket.emit('initialise chat', store.getState().messages);

    socket.on('disconnect', () => {
      console.log(`${socket.request.name} disconnected`);
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

  return io;
};

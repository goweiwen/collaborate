/* eslint-disable no-console */

import socketio from 'socket.io';
import cookie from 'cookie';
import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers/server';
import db from './db';
import {
  addTile, updateTile, removeTile, addChatMessage, updateLayout, updateAnnotation, enablePacking, disablePacking,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, INITIALISE_LAYOUTS, UPDATE_ANNOTATION, ENABLE_PACKING, DISABLE_PACKING,
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
    const store = createStore(
      reducer,
      initialState ? JSON.parse(initialState) : undefined,
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
      data.name = session.passport.user;
      accept(null, true);
    } else {
      console.log('Authentication error.');
    }
  });

  io.on('connection', (socket) => {
    // temporary constant
    const room = 'default';

    prepareRoom(room, (store) => {
      console.log(`${socket.request.name} joined '${room}'`);
      socket.join(room);

      const { layouts, tiles, messages, annotation, layoutSettings } = stores[room].getState();
      const user = socket.request.name;
      socket.emit('initialise', { user, layouts, tiles, messages, annotation });
      
      if(layoutSettings.packTiles) {
        socket.emit(ENABLE_PACKING);
      }

      socket.on(ENABLE_PACKING, () => {
        store.dispatch(enablePacking());
        socket.broadcast.emit(ENABLE_PACKING);
      });

      socket.on(DISABLE_PACKING, () => {
        store.dispatch(disablePacking());
        socket.broadcast.emit(DISABLE_PACKING);
      });

      socket.on('disconnect', () => {
        console.log(`${socket.request.name} left '${room}'`);
      });

      socket.on('drawing', (x0, y0, x1, y1, tool, erase) => {
        socket.broadcast.emit('drawing', x0, y0, x1, y1, tool, erase);
      });

      socket.on('clear', () => {
        socket.broadcast.emit('clear');
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

      socket.on(UPDATE_ANNOTATION, (dataURL) => {
        store.dispatch(updateAnnotation(dataURL));
        /* socket.broadcast.emit(UPDATE_ANNOTATION, dataURL);*/
      });
    });
  });

  return io;
};

/* eslint-disable no-console */

import socketio from 'socket.io';
import { applyMiddleware, createStore } from 'redux';
import reduxLogger from 'redux-logger';
import reducer from './reducers/server';
import {
  addTile, updateTile, removeTile, addChatMessage, updateLayout,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, INITIALISE_LAYOUTS,
} from './actions';

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

const store = createStore(
  reducer,
  state,
  applyMiddleware(reduxLogger),
);

export default (server) => {
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
};

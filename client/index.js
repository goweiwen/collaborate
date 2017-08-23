import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
// import logger from 'redux-logger';
import io from 'socket.io-client';
import 'babel-polyfill';
import App from './components/App';
import {
  addTile, removeTile, addChatMessage, updateTile, initialiseLayouts, updateLayout, updateAnnotation, userJoined, userLeft, userMoved,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, UPDATE_ANNOTATION, USER_JOINED, USER_LEFT, USER_MOVED,
} from '../actions';
import reducer from '../reducers/client';
import { calculateLayoutOnAdd } from './util/collision';

const store = createStore(
  reducer,
  // applyMiddleware(logger),
);

const emitAndDispatchTile = (socket, dispatch, tile, layout) => {
  const { tiles, layouts } = store.getState();
  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;

  const lastEditTime = new Date().toString();
  const newTile = { ...tile, id, lastEditTime, owner: user, lastEditBy: user };
  const newLayout = calculateLayoutOnAdd(layout, layouts);

  socket.emit(UPDATE_LAYOUT, newLayout, newTile.id);
  socket.emit(ADD_TILE, newTile, newTile.id);
  dispatch(updateLayout(newLayout, newTile.id));
  dispatch(addTile(newTile, newTile.id));
};

// wouldn't know id of tile on finishupload
const emitAndDispatchUpdateByName = (socket, dispatch, update, name) => {
  const { tiles } = store.getState();

  let id;

  tiles.forEach((tile) => {
    if (tile.name) {
      if (tile.name === name && tile.src === 'loading') {
        id = tile.id;
      }
    }
  });

  const newUpdate = { ...update, id };

  socket.emit(UPDATE_TILE, newUpdate);
  dispatch(updateTile(newUpdate));
};

const onDropAccepted = (socket, dispatch) => (accepted) => {
  const acceptedFile = accepted[0];
  let layout;
  let tile;

  if (acceptedFile.type === 'application/pdf') {
    layout = {
      x: 0,
      y: 0,
      width: 600,
      height: 800,
    };

    tile = {
      tileType: 'pdf',
      src: 'loading',
      page: 0,
      name: acceptedFile.name,
    };
  } else {
    layout = {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
    };

    tile = {
      tileType: 'image',
      src: 'loading',
      name: acceptedFile.name,
    };
  }

  emitAndDispatchTile(socket, dispatch, tile, layout);
};

const onFinishUpload = (socket, dispatch) => (info) => {

  const fileName = info.file.name;
  const update = {
    src: info.fileUrl,
  };

  emitAndDispatchUpdateByName(socket, dispatch, update, fileName);
};

const onDropRejected = (socket, dispatch) => (rejected) => {
  rejected.forEach((dataTransferItem) => {
    if (dataTransferItem.type === 'text/html') {
      dataTransferItem.getAsString((droppedHTML) => {
        const container = document.createElement('div');

        container.insertAdjacentHTML('afterbegin', droppedHTML);

        // if dragged item is from collaborate
        if (container.getElementsByClassName('collaborate-image')[0]) {
          return;
        }

        const src = container.getElementsByTagName('img')[0].src;

        if (src === '') {
          return;
        }

        const layout = {
          x: 0,
          y: 0,
          width: 300,
          height: 300,
          lockAspectRatio: false,
        };

        const tile = {
          src,
          tileType: 'image',
          user,
        };

        emitAndDispatchTile(socket, dispatch, tile, layout);
      });
    }
  });
};

class Root extends React.Component {
  getChildContext() {
    return { socket: this.socket };
  }

  componentWillMount() {
    this.socket = io({
      query: {
        // eslint-disable-next-line no-undef
        room,
      },
    });

    this.socket.on('initialise', ({ layouts, tiles, messages, annotation, users }) => {
      store.dispatch(initialiseLayouts(layouts));
      tiles.forEach(tile => store.dispatch(addTile(tile, tile.id)));
      messages.forEach(message => store.dispatch(addChatMessage(message)));
      store.dispatch(updateAnnotation(annotation));
      store.dispatch(userJoined({ user, photo, colour }));
      Object.keys(users).forEach((user) => {
        for (let i = 0; i < users[user].count; i++) {
          store.dispatch(userJoined(users[user]));
        }
      });
    });

    this.socket.on(ADD_TILE, (tile, id) => {
      store.dispatch(addTile(tile, id));
    });

    this.socket.on(UPDATE_ANNOTATION, (dataURL) => {
      store.dispatch(updateAnnotation(dataURL));
    });

    this.socket.on(ADD_CHAT_MESSAGE, (message) => {
      store.dispatch(addChatMessage(message));
    });

    this.socket.on(REMOVE_TILE, (id) => {
      store.dispatch(removeTile(id));
      store.dispatch(updateLayout(undefined, id));
    });

    this.socket.on(UPDATE_TILE, (tile) => {
      store.dispatch(updateTile(tile));
    });

    this.socket.on(UPDATE_LAYOUT, (layout, id) => {
      store.dispatch(updateLayout(layout, id));
    });

    this.socket.on(USER_JOINED, (user) => {
      store.dispatch(userJoined(user));
    });

    this.socket.on(USER_LEFT, (user) => {
      store.dispatch(userLeft(user));
    });

    this.socket.on(USER_MOVED, (user) => {
      store.dispatch(userMoved(user));
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route
            path="/" component={() => (<App
              onFinishUpload={onFinishUpload(this.socket, store.dispatch)}
              onDropRejected={onDropRejected(this.socket, store.dispatch)}
              onDropAccepted={onDropAccepted(this.socket, store.dispatch)}
            />)}
          />
        </Router>
      </Provider>
    );
  }
}

Root.childContextTypes = {
  socket: PropTypes.object,
};

ReactDOM.render(
  <Root />,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);

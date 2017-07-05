import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import io from 'socket.io-client';
import 'babel-polyfill';
import App from './components/App';
import { addTile, removeTile, addChatMessage, updateTile, initialiseLayouts, updateLayout, updateAnnotation,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, INITIALISE_LAYOUTS, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, UPDATE_ANNOTATION } from '../actions';
import reducer from '../reducers/client';

const store = createStore(
  reducer,
  applyMiddleware(),
);

const onFinishUpload = (socket, dispatch) => (info) => {
  // eslint-disable-next-line no-console
  console.log('File uploaded with filename', info.filename);
  // eslint-disable-next-line no-console
  console.log('Access it on s3 at', info.fileUrl);

  const layout = {
    x: 0,
    y: 0,
    width: 600,
    height: 800,
    lockAspectRatio: false,
  }

  const { tiles } = store.getState();
  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;

  const tile = {
    id,
    tileType: 'pdf',
    src: info.fileUrl,
    width: layout.width,
    page: 0,
  };

  console.log(tile)

  socket.emit(UPDATE_LAYOUT, layout, tile.id)
  socket.emit(ADD_TILE, tile, tile.id)
  dispatch(updateLayout(layout, tile.id));
  dispatch(addTile(tile, tile.id));
};

class Root extends React.Component {
  getChildContext() {
    return { socket: this.socket, user: this.user };
  }

  componentWillMount() {
    this.socket = io();

    this.socket.on('initialise user', (user) => {
      this.user = user;
    });

    this.socket.on(INITIALISE_LAYOUTS, (layouts) => {
      store.dispatch(initialiseLayouts(layouts));
    });

    this.socket.on('initialise tiles', (tiles) => {
      tiles.forEach(tile => store.dispatch(addTile(tile, tile.id)));
    });

    this.socket.on('initialise chat', (messages) => {
      messages.forEach(message => store.dispatch(addChatMessage(message)));
    });

    this.socket.on('initialise annotation', (dataURL) => {
      store.dispatch(updateAnnotation(dataURL));
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
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/" component={() => <App onFinishUpload={onFinishUpload(this.socket, store.dispatch)} />} />
        </Router>
      </Provider>
    );
  }
}

Root.childContextTypes = {
  socket: PropTypes.object,
  user: PropTypes.string,
};

ReactDOM.render(
  <Root />,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);

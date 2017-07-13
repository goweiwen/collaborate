import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import io from 'socket.io-client';
import 'babel-polyfill';
import App from './components/App';
import { addTile, removeTile, addChatMessage, updateTile, initialiseLayouts, updateLayout, updateAnnotation, enablePacking, disablePacking,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT, ADD_CHAT_MESSAGE, UPDATE_ANNOTATION, ENABLE_PACKING, DISABLE_PACKING } from '../actions';
import reducer from '../reducers/client';
import { calculateLayoutOnAdd } from './util/collision';
import logger from 'redux-logger';
const store = createStore(
  reducer,
  applyMiddleware(logger),
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
  };

  const { tiles, layouts } = store.getState();
  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;

  const tile = {
    id,
    tileType: 'pdf',
    src: info.fileUrl,
    page: 0,
  };

  const newLayout = calculateLayoutOnAdd(layout, layouts);

  socket.emit(UPDATE_LAYOUT, newLayout, tile.id);
  socket.emit(ADD_TILE, tile, tile.id);
  dispatch(updateLayout(newLayout, tile.id));
  dispatch(addTile(tile, tile.id));
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

    this.socket.on('initialise', ({ layouts, tiles, messages, annotation }) => {
      store.dispatch(initialiseLayouts(layouts));
      tiles.forEach(tile => store.dispatch(addTile(tile, tile.id)));
      messages.forEach(message => store.dispatch(addChatMessage(message)));
      store.dispatch(updateAnnotation(annotation));
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

    this.socket.on(ENABLE_PACKING, () => {
      store.dispatch(enablePacking());
    });

    this.socket.on(DISABLE_PACKING, () => {
      store.dispatch(disablePacking());
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

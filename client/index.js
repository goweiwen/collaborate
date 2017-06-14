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
import { addTile, removeTile, addChatMessage, updateTile, initialiseLayouts, updateLayout } from '../actions';
import { ADD_TILE, UPDATE_TILE, REMOVE_TILE, INITIALISE_LAYOUTS, UPDATE_LAYOUT, ADD_CHAT_MESSAGE } from '../actions';
import reducer from '../reducers/client';

const store = createStore(
  reducer,
  applyMiddleware(logger),
);

class Root extends React.Component {
  getChildContext() {
    return { socket: this.socket };
  }

  componentWillMount() {
    this.socket = io();

    this.socket.on(INITIALISE_LAYOUTS, (layouts) => {
      store.dispatch(initialiseLayouts(layouts));
    });

    this.socket.on('initialise tiles', (tiles) => {
      tiles.forEach(tile => store.dispatch(addTile(tile, tile.id)));
    });

    this.socket.on('initialise chat', (messages) => {
      messages.forEach(message => store.dispatch(addChatMessage(message)));
    });

    this.socket.on(ADD_TILE, (tile, id) => {
      store.dispatch(addTile(tile, id));
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
          <Route path="/" component={App} />
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

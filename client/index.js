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
import { addTile, removeTile, addChatMessage, updateTile } from '../actions';
import reducer from '../reducers/client';

const store = createStore(
  reducer,
  applyMiddleware(logger)
);

class Root extends React.Component {
  getChildContext() {
    return { socket: this.socket };
  }

  componentWillMount() {
    this.socket = io();

    this.socket.on('initialise', (tiles) => {
      tiles.forEach((tile) => store.dispatch(addTile(tile)));
    });

    this.socket.on('initialise chat', (messages) => {
      messages.forEach((message) => store.dispatch(addChatMessage(message)));
    });

    this.socket.on('add', (tile) => {
      store.dispatch(addTile(tile));
    });

    this.socket.on('add chat message', (message) => {
      store.dispatch(addChatMessage(message));
    });

    this.socket.on('remove', (id) => {
      store.dispatch(removeTile(id));
    });

    this.socket.on('update tile', (tile) =>{
      store.dispatch(updateTile(tile));
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
  socket: PropTypes.object
};

ReactDOM.render(
  <Root />,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

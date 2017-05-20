import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import App from './components/App';
import { addTile } from '../actions';
import reducer from '../reducers';
import io from 'socket.io-client';

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
      tiles.forEach((tile) => store.dispatch(addTile(tile)))
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
  document.getElementById('root')
);

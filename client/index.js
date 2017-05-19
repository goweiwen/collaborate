import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore } from 'redux';
import App from './components/App';
import reducer from './reducers';

const initialState = {
  tiles: [
    {id: 0, type: 'text', content: 'hi'},
    {id: 1, type: 'image', src: 'http://source.unsplash.com/random'},
    {id: 2, type: 'image', src: 'http://source.unsplash.com/random'},
    {id: 3, type: 'text', content: 'hello world'},
    {id: 4, type: 'image', src: 'http://source.unsplash.com/random'},
  ]
}

const store = createStore(reducer, initialState);

console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
);

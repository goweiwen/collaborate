import { combineReducers } from 'redux';
import tiles from './tiles';
import messages from './messages';
import layouts from './layouts';
import annotation from './annotation';


export default combineReducers({ tiles, messages, layouts, annotation });

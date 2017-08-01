import { combineReducers } from 'redux';
import tiles from './tiles';
import messages from './messages';
import layouts from './layouts';
import annotation from './annotation';
import users from './users';


export default combineReducers({ tiles, messages, layouts, annotation, users });

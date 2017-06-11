import { combineReducers } from 'redux';
import tiles from './tiles';
import messages from './messages';
import layouts from './layouts';

export default combineReducers({ tiles, messages, layouts });

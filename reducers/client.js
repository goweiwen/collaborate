import { combineReducers } from 'redux';
import tiles from './tiles';
import sideMenuVisible from './sidemenu';
import messages from './messages';
import layouts from './layouts';
import layoutsSettings from './layoutsSettings';
import annotation from './annotation';

export default combineReducers({ tiles, sideMenuVisible, messages, layouts, layoutsSettings, annotation });

import { combineReducers } from 'redux';
import tiles from './tiles';
import sideMenuVisible from './sidemenu';
import messages from './messages';
import layouts from './layouts';
import tool from './tool';
import annotation from './annotation';
import users from './users';


export default combineReducers({ tiles, sideMenuVisible, annotation, messages, layouts, tool, users });

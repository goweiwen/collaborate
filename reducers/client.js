import { combineReducers } from 'redux';
import tiles from './tiles';
import side_menu_visible from './sidemenu';
import messages from './messages';
import layouts from './layouts';

export default combineReducers({tiles, side_menu_visible, messages, layouts});
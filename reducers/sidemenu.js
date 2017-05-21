import {TOGGLE_SIDEMENU} from '../actions';

function side_menu_visible(state = false, action) {

	switch (action.type) {
		case TOGGLE_SIDEMENU:
			return !state;
		default:
			return state;	
	}
}

export default side_menu_visible;
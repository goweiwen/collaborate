import { TOGGLE_SIDEMENU } from '../actions';

function sideMenuVisible(state = false, action) {
  switch (action.type) {
    case TOGGLE_SIDEMENU:
      return !state;
    default:
      return state;
  }
}

export default sideMenuVisible;

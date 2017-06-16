import { TOGGLE_LAYOUT_LOCK } from '../actions';

function layoutsSettings(state = { locked: true }, action) {
  switch (action.type) {
    case TOGGLE_LAYOUT_LOCK:
      return { ...state, locked: !state.locked };
    default:
      return state;
  }
}

export default layoutsSettings;

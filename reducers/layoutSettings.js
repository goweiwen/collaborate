import { ENABLE_PACKING, DISABLE_PACKING } from '../actions';

function layoutSettings(state = {packLayouts: false}, action) {

  switch (action.type) {
    case ENABLE_PACKING:
      return {...state, packLayouts: true};
    case DISABLE_PACKING:
      return {...state, packLayouts: false};
    default:
      return state;
  }
}

export default layoutSettings;

import { INITIALISE_LAYOUTS, UPDATE_LAYOUT } from '../actions';

function layouts(state = {}, action) {
  let newLayouts;

  switch (action.type) {
    case UPDATE_LAYOUT:
      newLayouts = { ...state };

      if (action.layout === undefined) {
        delete newLayouts[action.id];
        return newLayouts;
      }

      newLayouts[action.id] = action.layout;
      return newLayouts;

    case INITIALISE_LAYOUTS:
      return { ...action.layouts };
    default:
      return state;
  }
}

export default layouts;

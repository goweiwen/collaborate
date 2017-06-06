import {INITIALISE_LAYOUTS, UPDATE_LAYOUT} from '../actions';

function layouts(state = {}, action){
  switch (action.type) {

    case UPDATE_LAYOUT:
      var newLayouts = { ...state };

      if(action.layout === undefined) {
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
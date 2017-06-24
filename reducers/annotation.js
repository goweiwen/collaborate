import { UPDATE_ANNOTATION } from '../actions';

function annotation(state = null, action) {
  switch (action.type) {
    case UPDATE_ANNOTATION:
      return action.dataURL;
    default:
      return state;
  }
}

export default annotation;

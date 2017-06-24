import { USE_DRAG_TOOL, USE_ERASER_TOOL, USE_PEN_TOOL, USE_SELECT_TOOL } from '../actions';

function layoutsSettings(state = 'select', action) {
  switch (action.type) {
    case USE_SELECT_TOOL:
      return 'select';
    case USE_DRAG_TOOL:
      return 'drag';
    case USE_PEN_TOOL:
      return 'pen';
    case USE_ERASER_TOOL:
      return 'eraser';
    default:
      return state;
  }
}

export default layoutsSettings;

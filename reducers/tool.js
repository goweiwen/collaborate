import { USE_DRAG_TOOL, USE_ERASER_TOOL, USE_PEN_TOOL, USE_SELECT_TOOL, USE_PEN_COLOR_TOOL, USE_ADD_TILE_FORM_TOOL } from '../actions';

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
    case USE_PEN_COLOR_TOOL:
      return `pen_${action.color}`;
    case USE_ADD_TILE_FORM_TOOL:
      return 'add_tile_form';
    default:
      return state;
  }
}

export default layoutsSettings;

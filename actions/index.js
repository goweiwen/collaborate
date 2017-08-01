// Tile actions
export const ADD_TILE = 'ADD_TILE';
export const UPDATE_TILE = 'UPDATE_TILE';
export const REMOVE_TILE = 'REMOVE_TILE';

export const addTile = (tile, id) => ({ type: ADD_TILE, tile, id });
export const updateTile = tile => ({ type: UPDATE_TILE, tile });
export const removeTile = id => ({ type: REMOVE_TILE, id });

// Layout actions
export const INITIALISE_LAYOUTS = 'INITIALISE_LAYOUTS';
export const UPDATE_LAYOUT = 'UPDATE_LAYOUT';

export const initialiseLayouts = layouts => ({ type: INITIALISE_LAYOUTS, layouts });
export const updateLayout = (layout, id) => ({ type: UPDATE_LAYOUT, layout, id });

// Menubar
export const USE_SELECT_TOOL = 'USE_SELECT_TOOL';
export const USE_DRAG_TOOL = 'USE_DRAG_TOOL';
export const USE_ERASER_TOOL = 'USE_ERASER_TOOL';

export const USE_PEN_TOOL = 'USE_PEN_TOOL';
export const USE_PEN_COLOR_TOOL = 'USE_PEN_COLOR_TOOL';

export const USE_ADD_TILE_FORM_TOOL = 'USE_ADD_TILE_FORM_TOOL';

export const useSelectTool = () => ({ type: USE_SELECT_TOOL });
export const useDragTool = () => ({ type: USE_DRAG_TOOL });
export const useEraserTool = () => ({ type: USE_ERASER_TOOL });
export const usePenTool = () => ({ type: USE_PEN_TOOL });
export const usePenColorTool = color => ({ type: USE_PEN_COLOR_TOOL, color });
export const useAddTileFormTool = () => ({ type: USE_ADD_TILE_FORM_TOOL });


// SideMenu Actions
export const TOGGLE_SIDEMENU = 'TOGGLE_SIDEMENU';
export const toggleSideMenu = () => ({ type: TOGGLE_SIDEMENU });

// Chat Actions
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';
export const addChatMessage = message => ({ type: ADD_CHAT_MESSAGE, message });

// Annotation Actions
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const updateAnnotation = dataURL => ({ type: UPDATE_ANNOTATION, dataURL });

// Users Actions
export const USER_JOINED = 'USER_JOINED';
export const USER_LEFT = 'USER_LEFT';

export const userJoined = user => ({ type: USER_JOINED, user });
export const userLeft = user => ({ type: USER_LEFT, user });

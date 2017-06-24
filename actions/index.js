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
export const TOGGLE_LAYOUT_LOCK = 'TOGGLE_LAYOUT_LOCK';

export const initialiseLayouts = layouts => ({ type: INITIALISE_LAYOUTS, layouts });
export const updateLayout = (layout, id) => ({ type: UPDATE_LAYOUT, layout, id });
export const toggleLayoutLock = () => ({ type: TOGGLE_LAYOUT_LOCK });

// SideMenu Actions
export const TOGGLE_SIDEMENU = 'TOGGLE_SIDEMENU';
export const toggleSideMenu = () => ({ type: TOGGLE_SIDEMENU });

// Chat Actions
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';
export const addChatMessage = message => ({ type: ADD_CHAT_MESSAGE, message });

// Annotation Actions
export const UPDATE_ANNOTATION = 'UPDATE_ANNOTATION';
export const updateAnnotation = dataURL => ({ type: UPDATE_ANNOTATION, dataURL });

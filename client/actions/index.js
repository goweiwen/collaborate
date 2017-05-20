export const ADD_TILE = 'ADD_TILE';
export const UPDATE_TILE = 'UPDATE_TILE';
export const REMOVE_TILE = 'REMOVE_TILE';

export const addTile = (tile) => ({ type: ADD_TILE, tile });
export const updateTile = (tile) => ({ type: UPDATE_TILE, tile });
export const removeTile = (id) => ({ type: REMOVE_TILE, id });

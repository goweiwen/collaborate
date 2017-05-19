export const UPDATE_TILE = 'UPDATE_TILE';
export const REMOVE_TILE = 'REMOVE_TILE';

export const updateTile = (id, content) => ({type: UPDATE_TILE, id, content});
export const removeTile = (id) => ({type: REMOVE_TILE, id});

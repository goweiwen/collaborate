import { ADD_TILE, UPDATE_TILE, REMOVE_TILE, EDIT_TILE_LAYOUT } from '../actions';

function tiles(state = [], action) {
  switch (action.type) {
    case ADD_TILE:
      if(state.length === 0) {
        return [{id: 0, ...action.tile}];
      }  
      //prevent child having same key
      return [ ...state, { id: state[state.length-1].id + 1, ...action.tile } ];
    case UPDATE_TILE:
      return state.map((tile) => tile.id === action.tile.id ? action.tile : tile);
    case REMOVE_TILE:
      return state.filter((tile) => tile.id !== action.id);
    default:
      return state;
  }
}

export default tiles;

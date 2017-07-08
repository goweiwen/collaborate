import { ADD_TILE, UPDATE_TILE, REMOVE_TILE } from '../actions';

function tiles(state = [], action) {
  switch (action.type) {
    case ADD_TILE:
      return [
        ...state,
        {
          id: action.id,
          ...action.tile,
        },
      ];
    case UPDATE_TILE:
      return state.map(tile => (tile.id === action.tile.id ? { ...tile, ...action.tile } : tile));
    case REMOVE_TILE:
      return state.filter(tile => tile.id !== action.id);
    default:
      return state;
  }
}

export default tiles;

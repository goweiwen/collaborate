import { ADD_TILE, UPDATE_TILE, REMOVE_TILE } from '../actions';

function tiles(state = [], action) {
  switch (action.type) {
    case ADD_TILE:
      return [
        ...state,
        {
          id: (state.length === 0 ? 0 : state[state.length-1].id + 1),
          ...action.tile
        }
      ];
    case UPDATE_TILE:
      return state.map((tile) => tile.id === action.tile.id ? action.tile : tile);
    case REMOVE_TILE:
      return state.filter((tile) => tile.id !== action.id);
    default:
      return state;
  }
}

export default tiles;

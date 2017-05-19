import { UPDATE_TILE, REMOVE_TILE } from '../actions';

function tiles(state = [], action) {
  switch (action.type) {
    case UPDATE_TILE:
      return [...state, {id: action.id, content: action.content}];
    case REMOVE_TILE:
      return state.filter((tile) => tile.id !== action.id);
    default:
      return state;
  }
}

export default tiles;

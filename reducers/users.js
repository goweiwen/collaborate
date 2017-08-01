import { USER_JOINED, USER_LEFT } from '../actions';

function users(state = {}, action) {
  switch (action.type) {
    case USER_JOINED:
      return { ...state, [action.user]: state[action.user] ? state[action.user] + 1 : 1 };
    case USER_LEFT:
      if (state[action.user] > 1) {
        return { ...state, [action.user]: state[action.user] - 1 };
      }
      const ret = { ...state };
      delete ret[action.user];
      return ret;
    default:
      return state;
  }
}

export default users;

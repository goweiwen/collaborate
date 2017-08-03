import { USER_JOINED, USER_LEFT, USER_MOVED } from '../actions';

function users(state = {}, action) {
  switch (action.type) {
    case USER_JOINED:
      return {
        ...state,
        [action.user.user]: {
          user: action.user.user,
          photo: action.user.photo,
          colour: action.user.colour,
          x: action.user.x,
          y: action.user.y,
          count: state[action.user.user] ? state[action.user.user].count + 1 : 1,
        },
      };
    case USER_LEFT:
      if (state[action.user.user].count > 1) {
        return {
          ...state,
          [action.user.user]: {
            ...state[action.user.user],
            count: state[action.user.user].count - 1,
          },
        };
      }
      const ret = { ...state };
      delete ret[action.user.user];
      return ret;
    case USER_MOVED:
      return {
        ...state,
        [action.user.user]: {
          ...state[action.user.user],
          x: action.user.x,
          y: action.user.y,
        },
      };
    default:
      return state;
  }
}

export default users;

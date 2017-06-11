import { ADD_CHAT_MESSAGE } from '../actions';

function messages(state = [], action) {
  switch (action.type) {
    case ADD_CHAT_MESSAGE:
      return [...state, { ...action.message }];
    default:
      return state;
  }
}

export default messages;

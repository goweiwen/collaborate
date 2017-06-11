import React from 'react';
import PropTypes from 'prop-types';

const ChatMessage = props => (
  <div>
    <span>{props.user}</span>
    <p>{props.text}</p>
  </div>
);

ChatMessage.propTypes = {
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default ChatMessage;

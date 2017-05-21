import React from 'react';
import PropTypes from 'prop-types';
import {Comment} from 'semantic-ui-react';

const ChatMessage = (props) => ( 
    <Comment>
      <Comment.Author>{props.user}</Comment.Author>
      <Comment.Text>{props.text}</Comment.Text>
    </Comment>
);


ChatMessage.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default ChatMessage;
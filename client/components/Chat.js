import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';

const formStyle = {
  width: '250px',
  height: '100%',
  bottom:0,
  right:0,
};

const commentStyle = {
  width: '250px',
  height: '800px',
  overflow: 'scroll'
};

const Chat = (props, context) => (
    <div style={{width: '250px'}}>

      <p style={commentStyle}>
        <h3>Comments</h3>
        {_.map(props.messages, (message) => <ChatMessage key={message.id} {...message}/>)}
      </p>

      <form style={formStyle} reply onSubmit={ e => {
        e.preventDefault();
        const text = document.getElementById('form_input').value;
        if(!text){
          return;
        }
        const message = {
          id: props.messages.length,
          user: context.socket.id + '',
          text: text
        };

        document.getElementById('form_input').value = '';
        props.addChatMessage(context.socket, message);
      }}>
      <input type='text-area' id='form_input'/>
      <button content='Add Reply' type='submit'/>
      </form>
    </div>
);

Chat.propTypes = {
  messages: PropTypes.array.isRequired,
  addChatMessage: PropTypes.func.isRequired
};

Chat.contextTypes = {
  socket: PropTypes.object
};

export default Chat;

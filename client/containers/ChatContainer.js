import { connect } from 'react-redux';
import Chat from '../components/Chat';
import { addChatMessage } from '../../actions';

const mapStateToProps = (state) => ({messages: state.messages});

const mapDispatchToProps = (dispatch) => ({
  addChatMessage: (socket, message) => {

    socket.emit('add chat message', message);
    dispatch(addChatMessage(message));
  },
 
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
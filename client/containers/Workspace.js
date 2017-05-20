import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { addTile, removeTile } from '../actions';

const mapStateToProps = (state) => ({tiles: state.tiles});

const mapDispatchToProps = (dispatch) => ({
  addTile: (socket, id) => {
    const tile = { tile: 'image', src: `http://source.unsplash.com/random/${id}` };
    socket.emit('add', tile);
    dispatch(addTile(tile));
  },
  removeTile: (socket, id) => {
    socket.emit('remove', id);
    dispatch(removeTile(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

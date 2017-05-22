import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { addTile, removeTile, updateTile } from '../../actions';

const mapStateToProps = (state) => ({tiles: state.tiles});

const mapDispatchToProps = (dispatch) => ({
  addTile: (socket, id) => {
    const tile = { tile: 'image', src: `https://unsplash.it/200/300?image=${id}`, layout: {x:0, y:0, height:'300px', width: '300px'} };
    socket.emit('add', tile);
    dispatch(addTile(tile));
  },
  removeTile: (socket, id) => {
    socket.emit('remove', id);
    dispatch(removeTile(id));
  },
  updateTile: (socket, tile) => {
    socket.emit('update tile', tile);
    dispatch(updateTile(tile));
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

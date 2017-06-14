import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { addTile, removeTile, updateTile, updateLayout } from '../../actions';
import { ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT } from '../../actions';


const mapStateToProps = state => ({ tiles: state.tiles, layouts: state.layouts });

const mapDispatchToProps = dispatch => ({
  submitTile: (socket, id, tile, layout) => {
    socket.emit(UPDATE_LAYOUT, layout, id);
    socket.emit(ADD_TILE, tile, id);
    dispatch(updateLayout(layout, id));
    dispatch(addTile(tile, id));
  },

  removeTile: (socket, id) => {
    socket.emit(REMOVE_TILE, id);
    dispatch(removeTile(id));
    dispatch(updateLayout(undefined, id));
  },
  updateTile: (socket, tile) => {
    socket.emit(UPDATE_TILE, tile);
    dispatch(updateTile(tile));
  },

  updateLayout: (socket, layout, id) => {
    socket.emit(UPDATE_LAYOUT, layout, id);
    dispatch(updateLayout(layout, id));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

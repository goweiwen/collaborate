import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { removeTile, updateLayout, updateTile, REMOVE_TILE, UPDATE_LAYOUT, UPDATE_TILE } from '../../actions';
import { onLayoutChange, calculateLayoutsOnRemove } from '../util/collision';

const emitUpdateLayout = (dispatch, socket, layout, id) => {
  socket.emit(UPDATE_LAYOUT, layout, id);
  dispatch(updateLayout(layout, id));
};

const emitRemoveTile = (dispatch, socket, id) => {
  socket.emit(REMOVE_TILE, id);
  dispatch(removeTile(id));
  dispatch(updateLayout(undefined, id));
};

const mapStateToProps = state => ({
  tiles: state.tiles,
  layouts: state.layouts,
  tool: state.tool,
});

const mapDispatchToProps = dispatch => ({

  removeTile: (socket, prevLayouts) => (id) => {
    emitRemoveTile(dispatch, socket, id);

    const layoutsToBeEmitted = calculateLayoutsOnRemove(id, prevLayouts, false);

    for (const i in layoutsToBeEmitted) {
      emitUpdateLayout(dispatch, socket, layoutsToBeEmitted[i], i);
    }
  },

  updateTile: (socket, user) => (tile) => {
    tile.lastEditBy = user;
    tile.lastEditTime = new Date().toString();

    socket.emit(UPDATE_TILE, tile);
    dispatch(updateTile(tile));
  },

  updateLayout: (socket, prevLayouts) => (newLayout, newLayoutId) => {
    const layoutsToBeEmitted = onLayoutChange(newLayout, newLayoutId, prevLayouts, false); // no packing
    for (const i in layoutsToBeEmitted) {
      emitUpdateLayout(dispatch, socket, layoutsToBeEmitted[i], i);
    }
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

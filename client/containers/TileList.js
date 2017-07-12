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
  packLayouts: state.layoutSettings.packLayouts,
});

const mapDispatchToProps = dispatch => ({

  removeTile: (socket, prevLayouts, pack) => (id) => {
    emitRemoveTile(dispatch, socket, id);

    const layoutsToBeEmitted = calculateLayoutsOnRemove(id, prevLayouts, pack);

    for (const i in layoutsToBeEmitted) {
      emitUpdateLayout(dispatch, socket, layoutsToBeEmitted[i], i);
    }
  },

  updateTile: (socket, tile) => {
    socket.emit(UPDATE_TILE, tile);
    dispatch(updateTile(tile));
  },

  updateLayout: (socket, prevLayouts, pack) => (newLayout, newLayoutId) => {
    const layoutsToBeEmitted = onLayoutChange(newLayout, newLayoutId, prevLayouts, pack); //no packing
    for (const i in layoutsToBeEmitted) {
      emitUpdateLayout(dispatch, socket, layoutsToBeEmitted[i], i);
    }
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

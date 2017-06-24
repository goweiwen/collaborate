import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { removeTile, updateLayout, updateTile, REMOVE_TILE, UPDATE_LAYOUT, UPDATE_TILE } from '../../actions';
import { resolveCurrentCollisions, packTiles } from '../util/collision';

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

    const newLayouts = { ...prevLayouts };
    delete newLayouts[id];

    const packedNewLayouts = packTiles(newLayouts);
    for (const i in packedNewLayouts) {
      emitUpdateLayout(dispatch, socket, packedNewLayouts[i], i);
    }
  },

  resolveCollisions: (socket, prevlayouts) => (layout, id) => {
    const layouts = { ...prevlayouts };

    layouts[id] = layout;
    const beforeLayouts = resolveCurrentCollisions(layouts, [id]);

    const finalLayouts = packTiles(beforeLayouts);

    for (const i in finalLayouts) {
      emitUpdateLayout(dispatch, socket, finalLayouts[i], i);
    }
  },

  updateTile: (socket, tile) => {
    socket.emit(UPDATE_TILE, tile);
    dispatch(updateTile(tile));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

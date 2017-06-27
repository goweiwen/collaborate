import _ from 'lodash';
import { connect } from 'react-redux';
import Menubar from '../components/Menubar';
import {
  addTile, removeTile, updateTile, updateLayout, useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT } from '../../actions';
import { layoutsCollide } from '../util/collision';

const mapStateToProps = state => ({ tiles: state.tiles, tool: state.tool, layouts: state.layouts, layoutsSettings: state.layoutsSettings });

const emitSubmitTile = (dispatch, socket, id, tile, layout) => {
  socket.emit(UPDATE_LAYOUT, layout, id);
  socket.emit(ADD_TILE, tile, id);
  dispatch(updateLayout(layout, id));
  dispatch(addTile(tile, id));
};

const mapDispatchToProps = dispatch => ({
  submitTile: (socket, layouts, id) => (tile, layout) => {
    const prevLayouts = layouts;
    let currentLayout = layout;
    let valid = false;

    const updateValid = (otherLayout) => {
      if ((layoutsCollide(currentLayout, otherLayout))) {
        valid = false;
      }
    };

    while (!valid) {
      valid = true;
      _.forEach(prevLayouts, updateValid);

      if (valid === true) {
        break;
      } else {
        currentLayout = { ...currentLayout, y: currentLayout.y + 50 };
      }
    }

    emitSubmitTile(dispatch, socket, id, tile, currentLayout);
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

  useSelectTool: () => {
    dispatch(useSelectTool());
  },

  useDragTool: () => {
    dispatch(useDragTool());
  },

  usePenTool: () => {
    dispatch(usePenTool());
  },

  useEraserTool: () => {
    dispatch(useEraserTool());
  },

  usePenColorTool: (color) => {
    dispatch(usePenColorTool(color));
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(Menubar);

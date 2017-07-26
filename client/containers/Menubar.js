import _ from 'lodash';
import { connect } from 'react-redux';
import Menubar from '../components/Menubar';
import {
  addTile, removeTile, updateTile, updateLayout, useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool, useAddTileFormTool,
  ADD_TILE, UPDATE_TILE, REMOVE_TILE, UPDATE_LAYOUT } from '../../actions';
import { calculateLayoutOnAdd, packLayouts } from '../util/collision';

const mapStateToProps = state => ({ tiles: state.tiles, tool: state.tool, layouts: state.layouts });

const emitSubmitTile = (dispatch, socket, id, tile, layout) => {
  const lastEditTime = new Date().toString();
  const newTile = { ...tile, id, lastEditTime, owner: user, lastEditBy: user };

  socket.emit(UPDATE_LAYOUT, layout, id);
  socket.emit(ADD_TILE, newTile, id);
  dispatch(updateLayout(layout, id));
  dispatch(addTile(newTile, id));
};

const emitUpdateLayout = (dispatch, socket, layout, id) => {
  socket.emit(UPDATE_LAYOUT, layout, id);
  dispatch(updateLayout(layout, id));
};

const mapDispatchToProps = dispatch => ({
  submitTile: (socket, layouts, id) => (tile, layout) => {
    const newTileLayout = calculateLayoutOnAdd(layout, layouts);
    emitSubmitTile(dispatch, socket, id, tile, newTileLayout);
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
  },

  useAddTileFormTool: () => {
    dispatch(useAddTileFormTool());
  },
  packLayouts: (socket, layouts) => () => {
    const layoutsToBeEmitted = packLayouts(layouts);
    for (const i in layoutsToBeEmitted) {
      emitUpdateLayout(dispatch, socket, layoutsToBeEmitted[i], i);
    }
  },


});

export default connect(mapStateToProps, mapDispatchToProps)(Menubar);

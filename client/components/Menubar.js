import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AddTileForm from './AddTileForm';


const Menubar = (props, context) => { 
  const { tiles, layouts, tool, packLayouts, submitTile, useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool, useAddTileFormTool, enablePacking, disablePacking } = props;
  console.log(packLayouts);
  const { socket, user } = context;

  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;
// `
  return (
    <div className="navbar has-shadow">
      <div className="navbar-start">
        
        <a className={`navbar-item ${tool === 'select' ? 'is-active' : ''}`} onClick={useSelectTool}><i className="fa fa-mouse-pointer" /></a>
        <a className={`navbar-item ${tool === 'drag' ? 'is-active' : ''}`} onClick={useDragTool} id="drag"><i className="fa fa-arrows" /></a>
        <a className={`navbar-item has-dropdown ${tool === 'pen' ? 'is-active' : ''} `} >
        <a className={`nav-item ${_.startsWith(tool, 'pen') ? 'is-active' : ''}`} onClick={usePenTool}>
          <i className="fa fa-pencil" />
        </a>
        <div className="navbar-dropdown">
          <div className="box black" onClick={() => { usePenColorTool('black'); }} />
          <div className="box red" onClick={() => { usePenColorTool('red'); }} />
          <div className="box green" onClick={() => { usePenColorTool('green'); }} />
          <div className="box blue" onClick={() => { usePenColorTool('blue'); }} />
          <div className="box yellow" onClick={() => { usePenColorTool('yellow'); }} />
        </div>
        </a>
        <a className={`navbar-item ${tool === 'eraser' ? 'is-active' : ''} `} onClick={useEraserTool}><i className="fa fa-eraser" /></a>
        <AddTileForm tool={tool} useSelectTool={useSelectTool} useAddTileFormTool={useAddTileFormTool} className="navbar-end" visible={false} submitTile={submitTile(socket, layouts, id)} />
        <a id="pack-button" className="navbar-item" onClick={(packLayouts) ? disablePacking(socket) : enablePacking(socket, layouts)}><i className={`fa ${packLayouts ? 'fa-arrow-up' : 'fa-ban'}`} /></a>
      </div>
        <img alt="collaborate!" src="assets/logo.png" className="navbar-item" id="logo" />

      
      <div className="navbar-end">
        <span className="navbar-item">{user}</span>
      </div>
    </div>);
};

Menubar.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  tool: PropTypes.string.isRequired,
  submitTile: PropTypes.func.isRequired,
  useSelectTool: PropTypes.func.isRequired,
  useDragTool: PropTypes.func.isRequired,
  usePenTool: PropTypes.func.isRequired,
  useEraserTool: PropTypes.func.isRequired,
  usePenColorTool: PropTypes.func.isRequired,
  disablePacking: PropTypes.func.isRequired,
  enablePacking: PropTypes.func.isRequired,
};

Menubar.contextTypes = {
  socket: PropTypes.object,
  user: PropTypes.string,
};

export default Menubar;

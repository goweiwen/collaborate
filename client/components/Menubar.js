import React from 'react';
import PropTypes from 'prop-types';
import AddTileForm from './AddTileForm';


const Menubar = (props, context) => {
  const { tiles, layouts, tool, submitTile, useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool } = props;
  const { socket } = context;

  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;

  let penDropdown;

  if (tool === 'pen') {
    penDropdown =
      (<div className="box dropdown">
        <a className="box black" onClick={() => { usePenColorTool('black'); }} />
        <a className="box red" onClick={() => { usePenColorTool('red'); }} />
        <a className="box green" onClick={() => { usePenColorTool('green'); }} />
        <a className="box blue" onClick={() => { usePenColorTool('blue'); }} />
        <a className="box yellow" onClick={() => { usePenColorTool('yellow'); }} />
      </div>);
  }

  return (
    <div className="nav has-shadow">
      <div className="nav-left">
        <a className={`nav-item ${tool === 'select' ? 'is-active' : ''}`} onClick={useSelectTool}><i className="fa fa-mouse-pointer" /></a>
        <a className={`nav-item ${tool === 'drag' ? 'is-active' : ''}`} onClick={useDragTool}><i className="fa fa-arrows" /></a>
        <a className={`nav-item ${tool === 'pen' ? 'is-active' : ''} `} onClick={usePenTool}><i className="fa fa-pencil" /></a>
        {penDropdown}
        <a className={`nav-item ${tool === 'eraser' ? 'is-active' : ''} `} onClick={useEraserTool}><i className="fa fa-eraser" /></a>
        <AddTileForm className="nav-item" visible={false} submitTile={submitTile(socket, layouts, id)} />
      </div>
      <div className="nav-center">
        <img src="assets/logo.png" className="nav-item" />
      </div>
      <div className="nav-right">
        <span className="nav-item">username</span>
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
};

Menubar.contextTypes = {
  socket: PropTypes.object,
};

export default Menubar;

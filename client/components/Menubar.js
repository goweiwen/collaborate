import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AddTileForm from './AddTileForm';


class Menubar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      burgerActive: false,
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(fn) {
    return (e) => {
      this.setState({ burgerActive: false });
      fn(e);
    };
  }

  render() {
    const { tiles, layouts, tool, packLayouts, submitTile, useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool, useAddTileFormTool } = this.props;
    const { socket } = this.context;


    const clickHandler = this.clickHandler;
    const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;
    return (
      <div className="navbar">
        <div className="navbar-brand">
          <img alt="collaborate!" src="assets/logo.png" className="navbar-item" id="logo" />
          <div
            className={`navbar-burger ${this.state.burgerActive ? 'is-active' : ''}`}
            onClick={() => { this.setState({ burgerActive: !this.state.burgerActive }); }}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={`navbar-menu ${this.state.burgerActive ? 'is-active' : ''}`}>
          <div className="navbar-end">
            <a className={`navbar-item ${tool === 'select' ? 'is-active' : ''}`} onClick={clickHandler(useSelectTool)}><i
              className="fa fa-mouse-pointer"
            /></a>
            <a className={`navbar-item ${tool === 'drag' ? 'is-active' : ''}`} onClick={clickHandler(useDragTool)} id="drag"><i
              className="fa fa-arrows"
            /></a>
            <a className={`navbar-item has-dropdown ${tool === 'pen' ? 'is-active' : ''} `}>
              <a className={`navbar-item ${_.startsWith(tool, 'pen') ? 'is-active' : ''}`} onClick={usePenTool}>
                <i className="fa fa-pencil" />
              </a>
              <div className={`navbar-dropdown ${tool === 'pen' ? '' : 'is-hidden'}`}>
                <div className="pen-colours black" onClick={clickHandler(() => { usePenColorTool('black'); })} />
                <div className="pen-colours red" onClick={clickHandler(() => { usePenColorTool('red'); })} />
                <div className="pen-colours green" onClick={clickHandler(() => { usePenColorTool('green'); })} />
                <div className="pen-colours blue" onClick={clickHandler(() => { usePenColorTool('blue'); })} />
                <div className="pen-colours yellow" onClick={clickHandler(() => { usePenColorTool('yellow'); })} />
              </div>
            </a>
            <a className={`navbar-item ${tool === 'eraser' ? 'is-active' : ''} `} onClick={clickHandler(useEraserTool)}><i
              className="fa fa-eraser"
            /></a>
            <a id="pack-button" className="navbar-item" onClick={clickHandler(packLayouts(socket, layouts))}><i
              className="fa fa-arrow-up"
            /></a>
            <AddTileForm
              tool={tool} useSelectTool={useSelectTool} useAddTileFormTool={useAddTileFormTool}
              className="navbar-item" visible={false} submitTile={submitTile(socket, layouts, id)}
            />
          </div>
        </div>
        <div className="navbar-end is-hidden-touch">
          <span className="navbar-item">{user}</span>
        </div>
      </div>);
  }
}

Menubar.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  tool: PropTypes.string.isRequired,
  submitTile: PropTypes.func.isRequired,
  packLayouts: PropTypes.func.isRequired,
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

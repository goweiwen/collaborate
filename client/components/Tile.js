import React from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import PDF from './tiles/PDF';
import GoogleDoc from './tiles/GoogleDoc';
import { calculateSince } from '../util/time';

const ENABLED = {
  bottom: true,
  bottomLeft: true,
  bottomRight: true,
  left: true,
  right: true,
  top: true,
  topLeft: true,
  topRight: true,
};

const DISABLED = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
};

const Tile = (props) => {
  const all = {
    id: props.id,
    tile: props.tile,
    width: props.width,
    height: props.height,
  };
  return (
    <div className={`card tile ${props.tool === 'drag' ? '' : 'locked'} ${props.tileType}`} id={props.id} >
      <div className="overlay" />
      {(() => {
        switch (props.tileType) {
          case 'text':
            return <Text {...all} content={props.content} updateTile={props.updateTile} />;
          case 'image':
            return <Image {...all} src={props.src} />;
          case 'youtube':
            return <YouTube {...all} src={props.src} />;
          case 'pdf':
            return <PDF {...all} src={props.src} page={props.page} updateTile={props.updateTile} />;
          case 'googledoc':
            return <GoogleDoc {...all} src={props.src} />;
          default:
            return <span>{props.type}</span>;
        }
      })()}
      <div className="notification tile-info">
        <div className="content is-small">
          {(props.owner === props.lastEditBy) ? (
            <p>created and edited by <strong>{props.owner}</strong> {calculateSince(props.lastEditTime)}</p>
          ) : (
            <p>created by <strong>{props.owner}</strong>, edited by <strong>{props.lastEditBy}</strong> {calculateSince(props.lastEditTime)}</p>
          )}
        </div>
      </div>
      <button className="close-button" onClick={() => props.removeTile(props.id)} >
        <span>✕</span>
      </button>
    </div>
  );
};

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  tile: PropTypes.object.isRequired,
  tileType: PropTypes.string.isRequired,
  removeTile: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  owner: PropTypes.string,
  lastEditBy: PropTypes.string,
  lastEditTime: PropTypes.string,
};

const MARGIN = 5;

class RndTile extends React.Component {

  constructor(props) {
    super(props);

    this.onDragOrResizeStop = this.onDragOrResizeStop.bind(this);
  }

  componentWillUpdate(nextProps) {
    let { x, y, width, height } = nextProps.layout;

    x += MARGIN;
    y += MARGIN;
    width -= MARGIN;
    height -= MARGIN;

    this.rnd.updatePosition({ x, y });
    this.rnd.updateSize({ width, height });
  }

  onDragOrResizeStop() {
    const tile = this.props.tile;

    const { x, y } = this.rnd.draggable.state;
    const { width, height } = this.rnd.resizable.state;

    const layout = { ...this.props.layout, x, y, width, height };
    this.props.updateLayout(layout, tile.id);
  }

  render() {
    const props = this.props;
    const layout = props.layout;

    return (
      <Rnd
        style={{ position: 'absolute', cursor: props.tool === 'drag' ? 'move' : 'auto' }}
        ref={(c) => { this.rnd = c; }}
        default={{ x: layout.x + MARGIN, y: layout.y + MARGIN, width: layout.width - MARGIN, height: layout.height - MARGIN }}
        minWidth={200}
        minHeight={200}
        onResizeStop={this.onDragOrResizeStop}
        onDragStop={this.onDragOrResizeStop}
        lockAspectRatio={layout.lockAspectRatio}
        enableResizing={props.tool === 'drag' ? ENABLED : DISABLED}
        disableDragging={props.tool !== 'drag'}
        bounds="parent"
      >
        <Tile width={layout.width - MARGIN} height={layout.height - MARGIN} {...props} />
      </Rnd>
    );
  }
}

RndTile.propTypes = {
  tile: PropTypes.object.isRequired,
  updateLayout: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired,
};

export default RndTile;

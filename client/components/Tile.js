import React from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import PDF from './tiles/PDF';
import GoogleDoc from './tiles/GoogleDoc';

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

const Tile = (props) => (
  <div className={`card tile ${props.tool === 'drag' ? '' : 'locked'} ${props.tileType === 'image' || props.tileType === 'youtube' ? 'is-paddingless' : ''}`} id={props.id} style={{ height: '100%', padding: '10px' }}>
    <div className="overlay" />
    {(() => {
      switch (props.tileType) {
        case 'text':
          return <Text id={props.id} content={props.content} width={props.width} height={props.height} updateTile={props.updateTile} />;
        case 'image':
          return <Image inline id={props.id} src={props.src} width={props.width} height={props.height} />;
        case 'youtube':
          return <YouTube id={props.id} src={props.src} width={props.width} height={props.height} />;
        case 'pdf':
          return <PDF id={props.id} {...props} width={props.width} height={props.height} updateTile={props.updateTile} />;
        case 'googledoc':
          return <GoogleDoc id={props.id} src={props.src} width={props.width} height={props.height} />;
        default:
          return <span>{props.type}</span>;
      }
    })()}
    <button className="close-button" onClick={() => props.removeTile(props.id)} >
      <span>✕</span>
    </button>
  </div>
  );

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  tileType: PropTypes.string.isRequired,
  removeTile: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
};

const GRID = 50;
const HALF_GRID = GRID / 2;
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

    let { x, y } = this.rnd.draggable.state;
    let { width, height } = this.rnd.resizable.state;

    // Snap to grid
    x += HALF_GRID - (x + HALF_GRID) % GRID;
    y += HALF_GRID - (y + HALF_GRID) % GRID;
    width += HALF_GRID - (width + HALF_GRID) % GRID;
    height += HALF_GRID - (height + HALF_GRID) % GRID;

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
        onResizeStop={this.onDragOrResizeStop }
        onDragStop={this.onDragOrResizeStop }
        lockAspectRatio={layout.lockAspectRatio}
        enableResizing={props.tool === 'drag' ? ENABLED : DISABLED}
        disableDragging={props.tool !== 'drag'}
        bounds="parent"
      >
        <Tile height={layout.height} width={layout.width} {...props} />
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

import React from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import _ from 'lodash';
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

const Tile = (props, context) => (
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
          return <PDF id={props.id} {...props} width={props.width} height={props.height} />;
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
  updateTile: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
};

Tile.contextTypes = {
  socket: PropTypes.object,
};

function getTranslateXValue(translateString) {
  const n = translateString.indexOf('(');
  const n1 = translateString.indexOf(',');
  const res = parseInt(translateString.slice(n + 1, n1 - 2), 10);
  return res;
}
function getTranslateYValue(translateString) {
  const n = translateString.indexOf(',');
  const n1 = translateString.indexOf(')');
  const res = parseInt(translateString.slice(n + 1, n1 - 1), 10);
  return res;
}


class RndTile extends React.Component {

  componentWillUpdate(nextProps) {
    const layout = { ...nextProps.layout };
    const rnd = this.rnd;

    const margin = 5;

    layout.x += margin;
    layout.y += margin;
    layout.height -= margin;
    layout.width -= margin;


    rnd.updateSize({ width: layout.width, height: layout.height });
    rnd.updatePosition({ x: layout.x, y: layout.y });
  }

  handleMoveStop() {
    const tile = this.props.tile;
    const props = this.props;
    const rnd = this.rnd;
    const layout = { ...props.layout };
    const rect = rnd.wrapper.firstChild.getBoundingClientRect();

    const transform = rnd.wrapper.style.transform;
    const y = getTranslateYValue(transform);
    const x = getTranslateXValue(transform);
    const height = rect.height;
    const width = rect.width;

    layout.height = height;
    layout.width = width;

    layout.x = x;
    layout.y = y;

    // snap to grid
    const snapX = (layout.x % 50 > 25) ? 50 : 0;
    const snapY = (layout.y % 50 > 25) ? 50 : 0;

    const snapHeight = (layout.height % 50 > 25) ? 50 : 0;
    const snapWidth = (layout.width % 50 > 25) ? 50 : 0;

    layout.x -= (layout.x % 50) - snapX;
    layout.y -= (layout.y % 50) - snapY;

    layout.height -= (layout.height % 50) - snapHeight;
    layout.width -= (layout.width % 50) - snapWidth;

    if (layout.x < 0 || layout.y < 0) {
      layout.x = (x < 0) ? 0 : x;
      layout.y = (y < 0) ? 0 : y;
      this.props.updateLayout(layout, tile.id);
      return;
    }
    // optimization
    if (!_.isEqual(layout, props.layout)) {
      this.props.updateLayout(layout, tile.id);
    }
  }

  render() {
    const props = this.props;
    const layout = { ...props.layout };
    const margin = 5;
    layout.x += margin;
    layout.y += margin;
    layout.height -= margin;
    layout.width -= margin;

    return (
      <Rnd
        style={{ position: 'absolute', cursor: props.tool === 'drag' ? 'move' : 'auto' }}
        ref={(c) => { this.rnd = c; }}
        default={layout}
        minWidth={200}
        minHeight={200}
        onResizeStop={this.handleMoveStop.bind(this)}
        onDragStop={this.handleMoveStop.bind(this)}
        lockAspectRatio={layout.lockAspectRatio}
        enableResizing={props.tool === 'drag' ? ENABLED : DISABLED}
        disableDragging={props.tool !== 'drag'}
      >
        <Tile height={layout.height} width={layout.width} {...props} />
      </Rnd>
    );
  }
}

RndTile.propTypes = {
  tile: PropTypes.object.isRequired,
  updateLayout: PropTypes.func.isRequired,
  updateTile: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
};

RndTile.contextTypes = {
  socket: PropTypes.object,
};

export default RndTile;

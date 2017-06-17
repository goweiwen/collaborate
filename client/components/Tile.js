import React from 'react';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import _ from 'lodash';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import PDF from './tiles/PDF';
import GoogleDoc from './tiles/GoogleDoc';

const Tile = (props, context) => (
  <div className={`card tile ${props.enableResizing.top ? '' : 'locked'}`} id={props.id} style={{ height: '100%', padding: '10px' }}>
    <div className="overlay" />
    {(() => {
      switch (props.tileType) {
        case 'text':
          return <Text id={props.id} content={props.content} width={props.width} height={props.height} />;
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
    <button className="close-button" onClick={() => props.removeTile(context.socket, props.id)} >
      <span>✕</span>
    </button>
  </div>
  );

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  tileType: PropTypes.string.isRequired,
  removeTile: PropTypes.func.isRequired,
  enableResizing: PropTypes.object.isRequired,
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
    const context = this.context;
    const rnd = this.rnd;
    const layout = { ...props.layout };
    const rect = rnd.wrapper.firstChild.getBoundingClientRect();

    const transform = rnd.wrapper.style.transform;
    const y = getTranslateYValue(transform);
    const x = getTranslateXValue(transform);
    const height = rect.height;
    const width = rect.width;

    layout.x = x;
    layout.y = y;
    layout.height = height;
    layout.width = width;

    // snap to grid
    const snapX = (layout.x % 50 > 25) ? 50 : 0;
    const snapY = (layout.y % 50 > 25) ? 50 : 0;

    const snapHeight = (layout.height % 50 > 25) ? 50 : 0;
    const snapWidth = (layout.width % 50 > 25) ? 50 : 0;

    layout.x -= (layout.x % 50) - snapX;
    layout.y -= (layout.y % 50) - snapY;

    layout.height -= (layout.height % 50) - snapHeight;
    layout.width -= (layout.width % 50) - snapWidth;

    if (!_.isEqual(layout, props.layout)) {
      this.props.updateLayout(context.socket, layout, tile.id);
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
        style={{ position: 'absolute', cursor: props.enableResizing.top ? 'move' : 'auto' }}
        ref={(c) => { this.rnd = c; }}
        default={layout}
        minWidth={200}
        minHeight={200}
        bounds="parent"
        onResizeStop={this.handleMoveStop.bind(this)}
        onDragStop={this.handleMoveStop.bind(this)}
        lockAspectRatio={layout.lockAspectRatio}
        dragAxis={props.enableResizing.top ? 'both' : 'none'}
        enableResizing={props.enableResizing}
      >
        <Tile height={layout.height} width={layout.width} locked={!props.enableResizing.top} {...props} />
      </Rnd>
    );
  }
}

RndTile.propTypes = {
  tile: PropTypes.object.isRequired,
  updateLayout: PropTypes.func.isRequired,
  enableResizing: PropTypes.object.isRequired,
};

RndTile.contextTypes = {
  socket: PropTypes.object,
};

export default RndTile;

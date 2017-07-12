import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tile from '../containers/Tile';

const TileList = (props, context) => {
  const { tiles, layouts, tool, removeTile, resolveCollisions, packLayouts } = props;
  const { socket } = context;

  return (
    <div style={{ width: '1900px', height: '4000px' }}>
      { _.map(tiles, tile => (
        <Tile
          key={tile.id}
          layout={layouts[tile.id]}
          bounds="parent"
          removeTile={removeTile(socket, layouts, packLayouts)}
          updateLayout={props.updateLayout(socket, layouts, packLayouts)}
          tool={tool}
          updateTile={props.updateTile}
          {...tile}
        />
      ))}
    </div>);
};

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  tool: PropTypes.string.isRequired,
  removeTile: PropTypes.func.isRequired,
  resolveCollisions: PropTypes.func.isRequired,
  updateLayout: PropTypes.func.isRequired,
  layoutSettings: PropTypes.object.isRequired,
};

TileList.contextTypes = {
  socket: PropTypes.object,
};

export default TileList;


import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tile from '../containers/Tile';

const TileList = (props, context) => {
  const { tiles, layouts, tool, removeTile, resolveCollisions } = props;
  const { socket } = context;

  return (
    <div style={{ width: '1900px', height: '4000px' }}>
      { _.map(tiles, tile => (
        <Tile
          key={tile.id}
          layout={layouts[tile.id]}
          bounds="parent"
          removeTile={removeTile(socket, layouts)}
          updateLayout={resolveCollisions(socket, layouts)}
          tool={tool}
          {...tile}
        />
      ))}
    </div>);
};

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  tool: PropTypes.object.isRequired,
  removeTile: PropTypes.func.isRequired,
  resolveCollisions: PropTypes.func.isRequired,
};

TileList.contextTypes = {
  socket: PropTypes.object,
};

export default TileList;


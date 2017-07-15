import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tile from '../containers/Tile';

const TileList = (props, context) => {
  const { tiles, layouts, tool, removeTile, packLayouts, updateLayout, updateTile } = props;
  const { socket } = context;

  return (
    <div style={{ width: '1900px', height: '4000px' }}>
      { _.map(tiles, tile => (
        <Tile
          key={tile.id}
          layout={layouts[tile.id]}
          bounds="parent"
          removeTile={removeTile(socket, layouts, packLayouts)}
          updateLayout={updateLayout(socket, layouts, packLayouts)}
          tool={tool}
          updateTile={updateTile}
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
  updateLayout: PropTypes.func.isRequired,
  packLayouts: PropTypes.func.isRequired,
  updateTile: PropTypes.func.isRequired,
};

TileList.contextTypes = {
  socket: PropTypes.object,
};

export default TileList;


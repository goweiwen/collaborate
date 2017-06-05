import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from '../containers/Tile';

const TileList = (props, context) => {
  return (
    <div >
      <button onClick={ () => props.addTile(context.socket, props.tiles.length) }>
        Add tile
      </button>
      <button onClick={ () => props.removeTile(context.socket, props.tiles.length - 1) }>
        Remove tile
      </button>
      <div style={{width: '1024px', height: '720px',}}>
        { _.map(props.tiles, (tile) => {return <Tile key={tile.id} { ...tile } removeTile={props.removeTile} updateTile={props.updateTile}/>;})}
      </div>
    </div>);
};

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  addTile: PropTypes.func.isRequired,
  removeTile: PropTypes.func.isRequired
};

TileList.contextTypes = {
  socket: PropTypes.object
};

export default TileList;

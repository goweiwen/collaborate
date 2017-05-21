import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from './Tile';
import { Button } from 'semantic-ui-react';


const TileList = (props, context) => (
    <div>
      <Button onClick={ () => props.addTile(context.socket, props.tiles.length) }>
        Add tile
      </Button>
      <Button onClick={ () => props.removeTile(context.socket, props.tiles.length - 1) }>
        Remove tile
      </Button>
      { _.map(props.tiles, (tile) => <Tile key={tile.id} { ...tile } removeTile={props.removeTile} />) }
    </div>
);

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  addTile: PropTypes.func.isRequired,
  removeTile: PropTypes.func.isRequired
};

TileList.contextTypes = {
  socket: PropTypes.object
};

export default TileList;

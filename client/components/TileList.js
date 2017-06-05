import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from '../containers/Tile';
import { Button} from 'semantic-ui-react';

const TileList = (props, context) => {

  const id = (props.tiles.length) === 0 ? 0 : props.tiles[props.tiles.length-1].id + 1;
  
  return (
    <div >
      <Button onClick={ () => props.addTile(context.socket, id) }>
        Add tile
      </Button>
      <Button onClick={ () => props.removeTile(context.socket, props.tiles.length - 1) }>
        Remove tile
      </Button>
      <div style={{width: '100vh', height: '100vh',}} >
        { _.map(props.tiles, (tile) => {return <Tile key={tile.id} layout={props.layouts[tile.id]} { ...tile } removeTile={props.removeTile} updateLayout={props.updateLayout}/>;})}
      </div>
    </div>);
};

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.array.isRequired,
  addTile: PropTypes.func.isRequired,
  removeTile: PropTypes.func.isRequired
};

TileList.contextTypes = {
  socket: PropTypes.object
};

export default TileList;

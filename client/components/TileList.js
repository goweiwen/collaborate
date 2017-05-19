import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from './Tile';

const TileList = (props) => (
    <div>
    {_.map(props.tiles, (tile) => <Tile key={tile.id} {...tile} />)}
    </div>
);

TileList.propTypes = {
  tiles: PropTypes.array.isRequired
};

export default TileList;

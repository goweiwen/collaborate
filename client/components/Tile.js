import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import Text from './tiles/Text';
import Image from './tiles/Image';
// import { Text, Image } from './tiles';

const Tile = (props) => (
  <Card id={props.id}>
    {(() => {
      switch (props.tile) {
        case 'text':
          return <Text id={props.id} content={props.content} />;
        case 'image':
          return <Image id={props.id} src={props.src} />;
        default:
          return <span>{props.type}</span>;
      }
    })()}
  </Card>
);

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  tile: PropTypes.string.isRequired,
  content: PropTypes.string,
  src: PropTypes.string
};

export default Tile;

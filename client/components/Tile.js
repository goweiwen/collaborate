import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card} from 'semantic-ui-react';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';

const Tile = (props, context) => (
  <Card id={props.id}>
    <Button onClick={() => props.removeTile(context.socket, props.id)}> x </Button>
    {(() => {
      switch (props.tile) {
        case 'text':
          return <Text id={props.id} content={props.content} />;
        case 'image':
          return <Image id={props.id} src={props.src} />;
        case 'youtube':
          return <YouTube id={props.id} src={props.src} />;
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
  src: PropTypes.string,
  removeTile: PropTypes.func.isRequired
};

Tile.contextTypes = {
  socket: PropTypes.object
};

export default Tile;

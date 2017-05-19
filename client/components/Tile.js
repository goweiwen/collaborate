import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'semantic-ui-react';

const Tile = (props) => (
  <Card id={props.id}>
    {(() => {
      switch (props.type) {
        case 'text':
          return <Card.Content>{props.content}</Card.Content>;
        case 'image':
          return <Image src={props.src} />;
        default:
          return <span>{props.type}</span>;
      }
    })()}
  </Card>
);

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string,
  src: PropTypes.string
};

export default Tile;

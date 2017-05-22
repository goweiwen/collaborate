import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card} from 'semantic-ui-react';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import Rnd from 'react-rnd'



const Tile = (props, context) => (
  <Card fluid id={props.id}>
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

const RndWrapper = (props, context)=> {
  let rnd;

  return (
     <Rnd style={{outline: '#FFFF00 dotted thick', position:'absolute'}}
      ref={c => { rnd = c; }}

      default={{...props.layout}}
      minWidth={200}
      minHeight={200}
      bounds="parent"
      onResizeStop={()=>{
        const layout = {...props.layout};
        const rect = rnd.wrapper.firstChild.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        const height = rect.height;
        const width = rect.width;

        layout.x = left - 400;
        layout.y = top - 70;  
        layout.height = height;
        layout.width = width;

        const tile = {...props, layout};
        props.updateTile(context.socket, tile);
      }}

      onDragStop={()=>{
        const layout = {...props.layout};
        const rect = rnd.wrapper.firstChild.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        layout.x = left - 400;
        layout.y = top - 70;  
        const tile = {...props, layout};

        props.updateTile(context.socket, tile);

      }}
    >
      <Tile {...props}  />
    </Rnd>
  
)};

RndWrapper.contextTypes = {
  socket: PropTypes.object
};


export default RndWrapper;
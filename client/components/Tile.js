import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import PDF from './tiles/PDF';
import Rnd from 'react-rnd';
import _ from 'lodash';

const Tile = (props, context) => (
  <Card fluid id={props.id} style={{height: '100%', padding:'10px'}}>
   <Button onClick={() => props.removeTile(context.socket, props.id)}> x </Button>
    {(() => {
      switch (props.tileType) {
        case 'text':
          return <Text id={props.id} content={props.content} />;
        case 'image':
          return <Image inline id={props.id} src={props.src} />;
        case 'youtube':
          return <YouTube id={props.id} src={props.src} />;
        case 'pdf':
          return <PDF id={props.id} {...props} />;
        default:
          return <span>{props.type}</span>;
      }
    })()}
  </Card>
);

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  tileType: PropTypes.string.isRequired,
  tile: PropTypes.object.isRequired,
  content: PropTypes.string,
  src: PropTypes.string,
  removeTile: PropTypes.func.isRequired
};

Tile.contextTypes = {
  socket: PropTypes.object
};

function getTranslateXValue(translateString){
  const n = translateString.indexOf('(');
  const n1 = translateString.indexOf(',');
  const res = parseInt(translateString.slice(n+1,n1-2));
  return res;

}
function getTranslateYValue(translateString){
  const n = translateString.indexOf(',');
  const n1 = translateString.indexOf(')');
  const res = parseInt(translateString.slice(n+1,n1-1));  
  return res;

}


class RndTile extends React.Component {

  componentWillUpdate(nextProps) {
    const layout = nextProps.layout;
    let rnd = this.rnd;
    rnd.updateSize({width: layout.width, height: layout.height});
    rnd.updatePosition({x: layout.x, y: layout.y});
  }

  handleMoveStop(){
   

    const props = this.props;
    const context = this.context;
    const rnd = this.rnd;
    const layout = {...props.layout};
    const rect = rnd.wrapper.firstChild.getBoundingClientRect();
   
    const transform = rnd.wrapper.style.transform;
    const y = getTranslateYValue(transform);
    const x = getTranslateXValue(transform);

    const height = rect.height;
    const width = rect.width;

    layout.x = x;
    layout.y = y;    
    layout.height = height;
    layout.width = width;

    if(!_.isEqual(layout, props.layout)) {
      const tile = {...props, layout};
      props.updateTile(context.socket, tile);
    }
  }
 
  render() {
    const props = this.props;    
    return (
      <Rnd 
       style={{position:'absolute' }}
        ref={c => { this.rnd = c; }}
        default={props.layout}
        minWidth={200}
        minHeight={200}
        bounds="parent"
        onResizeStop={this.handleMoveStop.bind(this)}
        onDragStop={this.handleMoveStop.bind(this)}>
        <Tile {...props}/>
      </Rnd>
    );
  }
}

RndTile.contextTypes = {
  socket: PropTypes.object
};




export default RndTile;

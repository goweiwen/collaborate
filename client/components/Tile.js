import React from 'react';
import PropTypes from 'prop-types';
import Text from './tiles/Text';
import Image from './tiles/Image';
import YouTube from './tiles/YouTube';
import PDF from './tiles/PDF';
import GoogleDoc from './tiles/GoogleDoc';
import Rnd from 'react-rnd';
import _ from 'lodash';

const Tile = (props, context) => (
  <div className='card' id={props.id} style={{height: '100%', padding:'10px'}}>
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
        case 'googledoc':
          return <GoogleDoc id={props.id} src={props.src}/>
        default:
          return <span>{props.type}</span>;
      }
    })()}
   <button className='close-button' onClick={() => props.removeTile(context.socket, props.id) }/>
  </div>
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
    let layout = {...nextProps.layout};
    let rnd = this.rnd;

    const margin = 5;

    layout.x += margin;
    layout.y += margin;
    layout.height -= margin;
    layout.width -= margin;



    rnd.updateSize({width: layout.width, height: layout.height});
    rnd.updatePosition({x: layout.x, y: layout.y});
  }

   handleMoveStop(){
    const tile = this.props.tile;
    const props = this.props;
    const context = this.context;
    const rnd = this.rnd;
    const layout = {...tile.layout};
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

    //snap to grid
    const snapX = (layout.x % 50 > 25) ? 50:0;
    const snapY = (layout.y % 50 > 25) ? 50:0;

    const snapHeight = (layout.height % 50 > 25) ? 50:0;
    const snapWidth = (layout.width % 50 > 25) ? 50:0;

    layout.x = layout.x - (layout.x%50) + snapX; 
    layout.y = layout.y- (layout.y%50) + snapY;

    layout.height = layout.height - (layout.height%50) + snapHeight; 
    layout.width = layout.width- (layout.width%50) + snapWidth; 


    if(!_.isEqual(layout, tile.layout)) {
      this.props.updateLayout(context.socket, layout, tile.id);
    }
  }

  render() {
    const props = this.props;
    let layout = {...props.layout};
    const margin = 5;

    layout.x += margin;
    layout.y += margin;
    layout.height -= margin;
    layout.width -= margin;

    return (
      <Rnd
       style={{position:'absolute' }}
        ref={c => { this.rnd = c; }}
        default={layout}
        minWidth={200}
        minHeight={200}
        bounds="parent"
        onResizeStop={this.handleMoveStop.bind(this)}
        onDragStop={this.handleMoveStop.bind(this)}
        width={props.layout.width}>
        <Tile {...props} />
      </Rnd>
    );
  }
}

RndTile.contextTypes = {
  socket: PropTypes.object
};




export default RndTile;

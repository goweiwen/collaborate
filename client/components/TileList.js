import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from '../containers/Tile';

const TileList = (props, context) => {
  const id = (props.tiles.length) === 0 ? 0 : props.tiles[props.tiles.length-1].id + 1;

  function packTiles(prevLayouts) {
    const layoutsCopy = {...prevLayouts};
    const newLayouts = {...prevLayouts};

    const findSmallestYid = (layouts) => {
      let smallestID;
      let smallestY = Infinity;

      _.forEach(layouts, (layout, layoutid_string) =>{
        if(layout.y < smallestY) {
          smallestID = layoutid_string;
          smallestY = layout.y; 
        }
      });
      return smallestID;
    };
       

    while(Object.keys(layoutsCopy).length > 0){
      let currentID = findSmallestYid(layoutsCopy);
      let currentLayout = {...layoutsCopy[currentID]};

      delete layoutsCopy[currentID];

      while(currentLayout.y > 0){
        currentLayout.y = currentLayout.y - 50;
        let valid = true;
        _.forEach(newLayouts, (layout, layoutid_string) => {
          
          if(layoutid_string === currentID) {
            return;
          }

          if(layoutsCollide(currentLayout, layout)) {
            valid = false;
          }  
        });
        if (!valid) {
          currentLayout.y = currentLayout.y + 50;
          break;
        }  
      }
      newLayouts[currentID] = currentLayout;
    }
    return newLayouts;
  }

  function resolveCollisions(prevlayouts) {
  
    return function(socket, layout, id) {
     
      let layouts = { ... prevlayouts}; 
      
      layouts[id] = layout;

      let finalLayouts = packTiles(resolveCurrentCollisions(layouts, [ id ], 0));

      for(const id in finalLayouts){
        props.updateLayout(socket, finalLayouts[id], id);
      }
    };
  }

  //layouts is the current layouts of the tileList while layouts are moving around to accomodate edits
      //ids is the last moved layouts from the previous iteration
      //count just for debug

  function resolveCurrentCollisions(layouts, ids, count) {
    
    //we did not move anything in the previous iteration. layout is valid and no collisions
    if(ids.length === 0){
      return layouts;
    }
 
    //keeps track of any collisions from last moved layouts (ids)
    let newCollisions = new Set();
    //keeps track of which ids had collisions
    let collidedIDs = new Set();
   
   //for each last move tile, we check if we have new collision with other tiles
    _.forEach(ids, (id) => {
      _.forEach(layouts, (layout, layoutid_string) => {
        const layoutid = parseInt(layoutid_string,10);
        if(layoutid !== id) {
          if(layoutsCollide(layouts[layoutid], layouts[id])) {
            newCollisions.add(layoutid);
            collidedIDs.add(id);
          }
        } 
      }
      );
    });

    //of all the the new collided tiles, find the lowest y (highest up )
    let lowestY = Infinity;

    for(let newCollisionID of newCollisions) {
      if(layouts[newCollisionID].y < lowestY) {
        lowestY = layouts[newCollisionID].y;
      }
    }

  
    //of all the previous tiles that were moved (the ids) and collides with the old layout, find the highest y (lowest down)
    let highestY = 0;
    
    for(let id of collidedIDs) {
      if(layouts[id].y + layouts[id].height> highestY) {
        highestY = layouts[id].y + layouts[id].height;
      }
    }

    //calculate translate distance.
    //the newly collided tiles will all move by that amount.
    const translateDist = highestY - lowestY;

    let newLayouts = {...layouts};
    let newIDs = [];
    
    for(let newCollisionID of newCollisions) {
      newLayouts[newCollisionID].y = newLayouts[newCollisionID].y + translateDist;
      newIDs.push(newCollisionID);
    }

    //now that we have moved all the newly collided tiles, we will check in the next iteration if there are new collisions
    return resolveCurrentCollisions(newLayouts, newIDs, count+1);
  }
  
 

  return (
    <div >
      <button onClick={ () => props.addTile(context.socket, id) }>
        Add tile
      </button>
      <button onClick={ () => props.removeTile(context.socket, props.tiles.length - 1) }>
        Remove tile
      </button>
      <div style={{width: '1024px', height: '720px',}}>
        { _.map(props.tiles, (tile) => {return <Tile key={tile.id} { ...tile } layout={props.layouts[tile.id]} removeTile={props.removeTile} updateLayout={resolveCollisions(props.layouts)}/>;})}
      </div>
    </div>);
};


TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  addTile: PropTypes.func.isRequired,
  removeTile: PropTypes.func.isRequired
};

TileList.contextTypes = {
  socket: PropTypes.object
};

export default TileList;



function layoutsCollide(layout1, layout2) {
  
  return (!(
    (layout1.x >= layout2.x + layout2.width) || 
    (layout1.x + layout1.width <= layout2.x) || 
    (layout1.y >= layout2.y + layout2.height)|| 
    (layout1.y + layout1.height <= layout2.y)
    ));

}


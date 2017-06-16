import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tile from '../containers/Tile';
import AddTileForm from './AddTileForm';

const TileList = (props, context) => {
  const id = (props.tiles.length) === 0 ? 0 : props.tiles[props.tiles.length - 1].id + 1;

  const packTiles = (prevLayouts) => {
    const layoutsCopy = { ...prevLayouts };
    const newLayouts = { ...prevLayouts };

    const findSmallestYid = (layouts) => {
      let smallestID;
      let smallestY = Infinity;

      _.forEach(layouts, (layout, layoutIdString) => {
        if (layout.y < smallestY) {
          smallestID = layoutIdString;
          smallestY = layout.y;
        }
      });
      return smallestID;
    };

    while (Object.keys(layoutsCopy).length > 0) {
      const currentID = findSmallestYid(layoutsCopy);
      const currentLayout = { ...layoutsCopy[currentID] };

      delete layoutsCopy[currentID];

      while (currentLayout.y > 0) {
        currentLayout.y -= 50;
        let valid = true;
        _.forEach(newLayouts, (layout, layoutIdString) => {
          if (layoutIdString === currentID) {
            return;
          }

          if (layoutsCollide(currentLayout, layout)) {
            valid = false;
          }
        });
        if (!valid) {
          currentLayout.y += 50;
          break;
        }
      }
      newLayouts[currentID] = currentLayout;
    }
    return newLayouts;
  };

  const resolveCollisions = prevlayouts => (socket, layout, id) => {
    const layouts = { ...prevlayouts };

    layouts[id] = layout;
    const beforeLayouts = resolveCurrentCollisions(layouts, [id]);

    const finalLayouts = packTiles(beforeLayouts);

    for (const i in finalLayouts) {
      props.updateLayout(socket, finalLayouts[i], i);
    }
  };

  // layouts is the current layouts of the tileList while layouts are moving around to accomodate edits
  // ids is the last moved layouts from the previous iteration
  const resolveCurrentCollisions = (layouts, ids) => {
    // we did not move anything in the previous iteration. layout is valid and no collisions
    if (ids.length === 0) {
      return layouts;
    }

    // keeps track of any collisions from last moved layouts (ids)
    const newCollisions = new Set();
    // keeps track of which ids had collisions
    const collidedIDs = new Set();

   // for each last move tile, we check if we have new collision with other tiles
    _.forEach(ids, (id) => {
      _.forEach(layouts, (layout, layoutIdString) => {
        const layoutid = parseInt(layoutIdString, 10);
        if (layoutid !== id) {
          if (layoutsCollide(layouts[layoutid], layouts[id])) {
            newCollisions.add(layoutid);
            collidedIDs.add(id);
          }
        }
      },
      );
    });

    // of all the the new collided tiles, find the lowest y (highest up )
    let lowestY = Infinity;

    for (const newCollisionID of newCollisions) {
      if (layouts[newCollisionID].y < lowestY) {
        lowestY = layouts[newCollisionID].y;
      }
    }


    // of all the previous tiles that were moved (the ids) and collides with the old layout, find the highest y (lowest down)
    let highestY = 0;

    for (const id of collidedIDs) {
      if (layouts[id].y + layouts[id].height > highestY) {
        highestY = layouts[id].y + layouts[id].height;
      }
    }

    // calculate translate distance.
    // the newly collided tiles will all move by that amount.
    const translateDist = highestY - lowestY;

    const newLayouts = { ...layouts };
    const newIDs = [];

    for (const newCollisionID of newCollisions) {
      newLayouts[newCollisionID].y += translateDist;
      newIDs.push(newCollisionID);
    }

    // now that we have moved all the newly collided tiles, we will check in the next iteration if there are new collisions
    return resolveCurrentCollisions(newLayouts, newIDs);
  };

  const submitTile = (tile, layout) => {
    const prevLayouts = props.layouts;
    let currentLayout = layout;
    let valid = false;

    const updateValid = (otherLayout) => {
      if ((layoutsCollide(currentLayout, otherLayout))) {
        valid = false;
      }
    };

    while (!valid) {
      valid = true;
      _.forEach(prevLayouts, updateValid);

      if (valid === true) {
        break;
      } else {
        currentLayout = { ...currentLayout, y: currentLayout.y + 50 };
      }
    }

    props.submitTile(context.socket, id, tile, currentLayout);
  };

  const removeTile = prevLayouts => (socket, id) => {
    props.removeTile(context.socket, id);

    const newLayouts = { ...prevLayouts };
    delete newLayouts[id];

    const packedNewLayouts = packTiles(newLayouts);
    for (const i in packedNewLayouts) {
      props.updateLayout(socket, packedNewLayouts[i], i);
    }
  };

  const tile = { tileType: 'image', src: '' };
  const layout = { x: 0, y: 0, height: 300, width: 300, lockAspectRatio: false };

  let toggleLayoutLockButton;
  if (props.layoutsSettings.locked) {
    toggleLayoutLockButton = <button onClick={() => props.toggleLayoutLock()}> Unlock Layout </button>;
  } else {
    toggleLayoutLockButton = <button onClick={() => props.toggleLayoutLock()}> Lock Layout </button>;
  }

  return (
    <div >
      {toggleLayoutLockButton}
      <button onClick={() => submitTile(tile, layout)}>
        Add tile
      </button>
      <AddTileForm visible={false} submitTile={submitTile} />
      <button onClick={() => (removeTile(props.layouts))(context.socket, props.tiles.length - 1)}>
        Remove tile
      </button>
      <div style={{ width: '100vw', height: '100vh' }}>
        { _.map(props.tiles, tile => <Tile locked={props.layoutsSettings.locked} key={tile.id} {...tile} layout={props.layouts[tile.id]} removeTile={removeTile(props.layouts)} updateLayout={resolveCollisions(props.layouts)} />)}
      </div>
    </div>);
};

TileList.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  layoutsSettings: PropTypes.object.isRequired,
  removeTile: PropTypes.func.isRequired,
  toggleLayoutLock: PropTypes.func.isRequired,
};

TileList.contextTypes = {
  socket: PropTypes.object,
};

export default TileList;


function layoutsCollide(layout1, layout2) {
  return (!(
    (layout1.x >= layout2.x + layout2.width) ||
    (layout1.x + layout1.width <= layout2.x) ||
    (layout1.y >= layout2.y + layout2.height) ||
    (layout1.y + layout1.height <= layout2.y)
    ));
}

import _ from 'lodash';

// layouts is the current layouts of the tileList while layouts are moving around to accomodate edits
// ids is the last moved layouts from the previous iteration
export const resolveCurrentCollisions = (layouts, ids) => {
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
    });
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

export const packTiles = (prevLayouts) => {

  console.log(prevLayouts);
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

  console.log(newLayouts);
  return newLayouts;
};

export const layoutsCollide = (layout1, layout2) => !(
  (layout1.x >= layout2.x + layout2.width) ||
  (layout1.x + layout1.width <= layout2.x) ||
  (layout1.y >= layout2.y + layout2.height) ||
  (layout1.y + layout1.height <= layout2.y)
);


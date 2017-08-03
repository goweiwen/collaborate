import _ from 'lodash';


const GRID = 50;
const HALF_GRID = 25;


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

export const packLayouts = (layouts) => {
  const ret = { ...layouts };

  // Repeat until we can't pack any more
  let changed = true;
  while (changed) {
    changed = false;

    // Pack by y position
    const sortedByY = _.sortBy(Object.keys(layouts), i => layouts[i].y);
    for (let i of sortedByY) {
      let y = ret[i].y - GRID;
      let layout = { ...ret[i], y };
      while (validLayout(layout) && !anyCollisions(i, layout, ret)) {
        changed = true;
        y -= GRID;
        layout = { ...ret[i], y };
      }
      ret[i].y = y + GRID;
    }

    // Pack by x position
    const sortedByX = _.sortBy(Object.keys(layouts), i => layouts[i].x);
    for (let i of sortedByX) {
      let x = ret[i].x - GRID;
      let layout = { ...ret[i], x };
      while (validLayout(layout) && !anyCollisions(i, layout, ret)) {
        changed = true;
        x -= GRID;
        layout = { ...ret[i], x };
      }
      ret[i].x = x + GRID;
    }

  }

  return ret;
};

const validLayout = (layout) => layout.x >= 0 && layout.y >= 0;

const layoutsCollide = (layout1, layout2) => !(
  (layout1.x >= layout2.x + layout2.width) ||
  (layout1.x + layout1.width <= layout2.x) ||
  (layout1.y >= layout2.y + layout2.height) ||
  (layout1.y + layout1.height <= layout2.y)
);

const anyCollisions = (id, layout, layouts) =>
  _.some(Object.keys(layouts), i => id !== i && layoutsCollide(layout, layouts[i]));

const intendedLayout = (newLayout, newLayoutId, prevLayouts) => {
  let y = newLayout.y;

  _.forEach(prevLayouts, (layout, id) => {
    if (id !== newLayoutId) {
      if (layoutsCollide(newLayout, layout)) {
        if (newLayout.y > layout.y + layout.height / 2) {
          if (layout.y + layout.height > y);
          y = layout.y + layout.height;
        }
      }
    }
  });
  return { ...newLayout, y };
};

const snapToGrid = (layout) => {
  let { x, y, width, height } = layout;
  // Snap to grid
  x += HALF_GRID - (x + HALF_GRID) % GRID;
  y += HALF_GRID - (y + HALF_GRID) % GRID;
  width += HALF_GRID - (width + HALF_GRID) % GRID;
  height += HALF_GRID - (height + HALF_GRID) % GRID;

  return { x, y, width, height };
};

export const onLayoutChange = (newLayout, newLayoutId, prevLayouts, pack) => {
  const newSnappedLayout = snapToGrid(newLayout);
  const intendedNewLayout = intendedLayout(newSnappedLayout, newLayoutId, prevLayouts);
  const newLayouts = { ...prevLayouts };
  newLayouts[newLayoutId] = intendedNewLayout;

  const finalLayouts = resolveCurrentCollisions(newLayouts, [newLayoutId]);

  if (pack) {
    return packLayouts(finalLayouts);
  }
  return finalLayouts;
};

export const calculateLayoutOnAdd = (newLayout, prevLayouts) => {
  let currentLayout = newLayout;
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
      currentLayout = { ...currentLayout, y: currentLayout.y + GRID };
    }
  }

  return currentLayout;
};

export const calculateLayoutsOnRemove = (deletedLayoutId, prevLayouts, pack) => {
  const newLayouts = { ...prevLayouts };
  delete newLayouts[deletedLayoutId];

  if (pack) {
    return packLayouts(newLayouts);
  }
  return newLayouts;
};

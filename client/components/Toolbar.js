import React from 'react';
import PropTypes from 'prop-types';
import AddTileForm from './AddTileForm';
import AnnotationLayer from '../containers/AnnotationLayer';


const Toolbar = (props, context) => {
  const { tiles, layouts, layoutsSettings, submitTile, toggleLayoutLock } = props;
  const { socket } = context;

  const id = (tiles.length) === 0 ? 0 : tiles[tiles.length - 1].id + 1;

  const toggleLayoutLockButton = <button onClick={() => toggleLayoutLock()}>{ layoutsSettings.locked ? 'Unlock Layout' : 'Lock Layout'} </button>;

  return (
    <div >
      {toggleLayoutLockButton}
      <AddTileForm visible={false} submitTile={submitTile(socket, layouts, id)} />

      <AnnotationLayer />
    </div>);
};

Toolbar.propTypes = {
  tiles: PropTypes.array.isRequired,
  layouts: PropTypes.object.isRequired,
  layoutsSettings: PropTypes.object.isRequired,
  submitTile: PropTypes.func.isRequired,
  toggleLayoutLock: PropTypes.func.isRequired,
};

Toolbar.contextTypes = {
  socket: PropTypes.object,
};

export default Toolbar;

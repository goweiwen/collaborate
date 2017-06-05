import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';
import { updateTile } from '../../../actions';

const onPageLoad = (socket, tile) => ({ pageIndex }) => {
  const newTile = { ...tile, page: pageIndex };
  socket.emit('update tile', { id: tile.id, tile: newTile });
  updateTile(tile.id, newTile);
};

const PDF = (props, context) => 
  <ReactPDF
          
      file={props.src}
      pageIndex={props.page}
      onPageLoad={onPageLoad(context.socket, props.tile)}
  />;
  

PDF.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
 /* pageIndex: PropTypes.number.isRequired,
  onDocumentLoad: PropTypes.func.isRequired,
  onPageLoad: PropTypes.func.isRequired,*/
  tile: PropTypes.object.isRequired
};

PDF.contextTypes = {
  socket: PropTypes.object
};

export default PDF;

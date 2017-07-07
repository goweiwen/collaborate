import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';
import { updateTile } from '../../../actions';

const onPageLoad = (socket, tile) => ({ pageIndex }) => {
  const newTile = { ...tile, page: pageIndex };
  socket.emit('update tile', { id: tile.id, tile: newTile });
  updateTile(tile.id, newTile);
};

const padding = 10;

const PDF = (props, context) =>
  (<ReactPDF
    style={{ height: '100%' }}
    file={props.src}
    width={props.width - 2 * padding}
    height={props.height - 2 * padding}
    pageIndex={props.page}
    onPageLoad={onPageLoad(context.socket, props.tile)}
  />);


PDF.propTypes = {
  src: PropTypes.string.isRequired,
  tile: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

PDF.contextTypes = {
  socket: PropTypes.object,
};

export default PDF;

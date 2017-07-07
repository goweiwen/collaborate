import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';
import { UPDATE_TILE, updateTile } from '../../../actions';

const padding = 10;

class PDF extends React.Component {
  constructor(props) {
    super(props);

    this.onPageLoad = this.onPageLoad.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onPageLoad({ pageIndex }) {
    const tile = this.props.tile;
    const newTile = { ...tile, page: pageIndex };
    this.context.socket.emit(UPDATE_TILE, newTile);
    updateTile(tile.id, newTile);
  }

  onClick(e) {
    const bounds = this.el.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const w = bounds.width;

    const tile = this.props.tile;
    if (x < w / 3) {
      this.props.updateTile(this.context.socket, { id: tile.id, page: tile.page - 1 });
    } else if (x > 2 * w / 3) {
      this.props.updateTile(this.context.socket, { id: tile.id, page: tile.page + 1 });
    }
  }

  render() {
    const props = this.props;

    return (
      <div
        onClick={this.onClick}
        ref={(el) => { this.el = el; }}
      >
        <ReactPDF
          file={props.src}
          width={props.width - 2 * padding}
          pageIndex={props.page}
          onPageLoad={this.onPageLoad}
        />
      </div>
    );

  }
}

PDF.propTypes = {
  src: PropTypes.string.isRequired,
  tile: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  updateTile: PropTypes.func.isRequired,
};

PDF.contextTypes = {
  socket: PropTypes.object,
};

export default PDF;

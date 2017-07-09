import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';

class PDF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curlingLeft: false,
      curlingRight: false,
    };

    this.onPageLoad = this.onPageLoad.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onDocumentLoad({ total }) {
    this.total = total;
  }

  onPageLoad() {
    if (!this.state.curlingLeft && !this.state.curlingRight) {
      this.setState({ curlingRight: true, curled: true });
      setTimeout(() => {
        this.setState({ curlingRight: false, curled: false });
      }, 200);
    } else {
      this.setState({ curled: true });
      setTimeout(() => {
        this.setState({ curled: false });
      }, 200);
    }
  }

  onMouseMove(e) {
    const bounds = this.el.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const w = bounds.width;

    if (x < w / 3) {
      this.setState({ curlingLeft: true });
    } else if (x > 2 * w / 3) {
      this.setState({ curlingRight: true });
    } else {
      this.setState({ curlingLeft: false, curlingRight: false });
    }
  }

  onMouseLeave() {
    this.setState({ curlingLeft: false, curlingRight: false });
  }

  onClick(e) {
    const bounds = this.el.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const w = bounds.width;

    const tile = this.props.tile;

    let page = 0;
    if (x < w / 3) {
      page = -1;
    } else if (x > 2 * w / 3) {
      page = 1;
    }

    if (page !== 0 && tile.page + page >= 0 && tile.page + page < this.total) {
      this.props.updateTile(this.context.socket, { id: this.props.id, page: tile.page + page });
    }
  }

  render() {
    const props = this.props;

    return (
      <div
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={(el) => { this.el = el; }}
        style={{ padding: 0 }}
      >
        <ReactPDF
          file={props.src}
          width={props.width}
          pageIndex={props.page}
          onPageLoad={this.onPageLoad}
          onDocumentLoad={this.onDocumentLoad}
        />
        <div className={`curlLeft ${this.state.curlingLeft ? (this.state.curled ? 'curled' : 'curling') : ''}`} />
        <div className={`curlRight ${this.state.curlingRight ? (this.state.curled ? 'curled' : 'curling') : ''}`} />
      </div>
    );
  }
}

PDF.propTypes = {
  id: PropTypes.number.isRequired,
  tile: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  updateTile: PropTypes.func.isRequired,
};

PDF.contextTypes = {
  socket: PropTypes.object,
};

export default PDF;

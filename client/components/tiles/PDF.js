import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';

class PDF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 0,
    };

    this.onPageLoad = this.onPageLoad.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentWillReceiveProps(nextProps) {

  }


  onDocumentLoad({ total }) {
    this.setState({ total });
  }

  onPageLoad() {
    this.setState({ turning: true });
    setTimeout(() => {
      this.setState({ turning: false });
    }, 500);
  }

  onMouseMove(e) {
    const direction = this.getDirection(e);
    if (this.state.direction !== direction) {
      this.setState({ direction });
    }
  }

  onMouseLeave() {
    this.setState({ direction: 0 });
  }

  onClick(e) {
    this.onMouseMove(e);

    if (this.state.direction === 0) {
      return;
    }

    const tile = this.props.tile;
    const page = tile.page + this.state.direction;


    if (page >= 0 && page < this.state.total) {
      this.props.updateTile({ id: this.props.id, page });
    }
  }

  getDirection(e) {
    const x = e.clientX - this.el.getBoundingClientRect().left;
    const w = this.props.width;

    if (x < w / 3) {
      return -1;
    } else if (x > 2 * w / 3) {
      return 1;
    }
    return 0;
  }

  render() {
    const { props, state } = this;

    const className =
      (state.turning ? 'turning' : '') +
      (state.direction === -1 && props.page - 1 >= 0 ? ' peeling-left' : '') +
      (state.direction === 1 && props.page + 1 < state.total ? ' peeling-right' : '');

    return (
      <div
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={(el) => { this.el = el; }}
        className={className}
        style={{ padding: 0 }}
      >
        <ReactPDF
          file={props.src}
          width={props.width}
          pageIndex={props.page}
          onPageLoad={this.onPageLoad}
          onDocumentLoad={this.onDocumentLoad}
        />
        <div className={`peel ${className}`} />
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

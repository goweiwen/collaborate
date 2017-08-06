import React from 'react';
import PropTypes from 'prop-types';
import ReactPDF from 'react-pdf';
import Loader from '../Loader';

class PDF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 0,
      page: props.page,
      pageNumber: 1,
      total: 1,
    };

    this.onPageLoad = this.onPageLoad.bind(this);
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page && nextProps.page !== this.state.page) {
      this.setState({ turning: true });
      setTimeout(() => {
        this.setState({ turning: false, page: nextProps.page });
      }, 200);
    }
  }

  onDocumentLoad({ total }) {
    this.setState({ total });
  }

  onPageLoad({ pageNumber }) {
    this.setState({ pageNumber });
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

    if (props.src === 'loading') {
      return <Loader width={props.width} height={props.height} />;
    }

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
          pageIndex={state.page}
          onPageLoad={this.onPageLoad}
          onDocumentLoad={this.onDocumentLoad}
          loading={<Loader width={props.width} height={props.height} />}
        />
        <div className={`peel ${className}`} />
        <div className="notification page-number"><div className="content is-small"><strong>{`${state.pageNumber}`}</strong>/<strong>{`${state.total}`}</strong></div></div>
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

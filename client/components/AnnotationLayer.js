import React from 'react';
import PropTypes from 'prop-types';

export default class AnnotationLayer extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
    };
  }


  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = 1900;
    this.canvas.height = 4000;

    const rect = this.canvas.getBoundingClientRect();
    this.top = rect.top;
    this.left = rect.left;

    this.context.socket.on('drawing', this.drawLine.bind(this));
    this.context.socket.on('clear', this.clear.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const img = new Image();
    img.src = nextProps.annotation;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
    };
  }

  clear(save) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (save) {
      const dataURL = this.canvas.toDataURL();
      this.props.updateAnnotation(this.context.socket, dataURL);
      this.context.socket.emit('clear');
    }
  }

  drawLine(x0, y0, x1, y1, emit) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round';

    if (this.props.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 40;
    }

    ctx.stroke();
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';

    if (!emit) { return; }


    this.context.socket.emit('drawing',
      x0, y0, x1, y1,
    );
  }


  mouseDown(e) {
    e.preventDefault();
    e.persist();
    this.setState(() => ({ drawing: true, x: e.clientX + window.scrollX - this.left, y: e.clientY + window.scrollY - this.top }));
  }

  mouseUp(e) {
    e.preventDefault();
    e.persist();
    const dataURL = this.canvas.toDataURL();
    this.props.updateAnnotation(this.context.socket, dataURL);
    this.setState(() => ({ drawing: false, x: e.clientX + window.scrollX - this.left, y: e.clientY + window.scrollY - this.top }));
  }

  mouseMove(e) {
    e.preventDefault();
    e.persist();


    if (this.state.drawing) {
      this.drawLine(this.state.x, this.state.y, e.clientX + window.scrollX - this.left, e.clientY + window.scrollY - this.top, true);
      this.setState(() => ({ x: e.clientX + window.scrollX - this.left, y: e.clientY + window.scrollY - this.top }));
    }
  }


  render() {
    const { tool } = this.props;

    return (
      <div>
        {/* <button onClick={() => { this.clear(true); }}>Clear</button></p> */}
        <canvas
          className="AnnotationCanvas"
          style={{ position: 'absolute', zIndex: 3, pointerEvents: tool === 'pen' || tool === 'eraser' ? 'all' : 'none' }}
          ref={(canvas) => { this.canvas = canvas; }}
          onMouseDown={e => this.mouseDown(e)}
          onMouseUp={e => this.mouseUp(e)}
          onMouseMove={e => throttle(this.mouseMove(e), 10)}
        />
      </div>
    );
  }
}

AnnotationLayer.contextTypes = {
  socket: PropTypes.object,
};

AnnotationLayer.propTypes = {
  annotation: PropTypes.string.isRequired,
  updateAnnotation: PropTypes.func.isRequired,
  usePenTool: PropTypes.func.isRequired,
  useEraserTool: PropTypes.func.isRequired,
  tool: PropTypes.string.isRequired,
};

 // limit the number of events per second
function throttle(callback, delay, ...rest) {
  let previousCall = new Date().getTime();
  return function () {
    const time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback(...rest);
    }
  };
}

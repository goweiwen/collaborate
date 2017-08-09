import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import TileList from '../containers/TileList';
import Menubar from '../containers/Menubar';
import UserList from '../containers/UserList';
import Cursors from '../containers/Cursors';
import AnnotationLayer from '../containers/AnnotationLayer';
import Joyride from '../containers/JoyRide';
import { S3_URL } from '../../credentials';
import { userMoved, USER_MOVED } from '../../actions';


const uploadOptions = {
  server: 'https://collaborate-app.herokuapp.com',
  s3Url: S3_URL,
};

const dispatchAndEmit = _.debounce((dispatch, socket, payload) => {
  dispatch(userMoved(payload));
  socket.emit(USER_MOVED, payload);
}, 250, { maxWait: 1000 });

const handleMouseMove = (dispatch, socket) => (e) => {
  // eslint-disable-next-line no-undef
  dispatchAndEmit(dispatch, socket, { user, x: e.pageX, y: e.pageY });
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
    };

    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);
  }

  onProgress(percent, message) {
    this.setState({ percent });
  }

  onError(message) {
    this.setState({ percent: 0 });
  }

  render() {
    const { props, context } = this;
    return (
      <DropzoneS3Uploader
        accept="application/pdf, image/*"
        style={{}}
        disableClick
        onDropRejected={props.onDropRejected}
        onDropAccepted={props.onDropAccepted}
        onProgress={this.onProgress}
        onFinish={props.onFinishUpload}
        onError={this.onError}
        upload={uploadOptions}
        s3Url={S3_URL}
      >
        <div onMouseMove={handleMouseMove(props.dispatch, context.socket)}>
          <Menubar />
          {(window.localStorage.getItem('tourFinished') !== 'true') && <Joyride />}
          <UserList />
          <Cursors />
          <div className="workspace">
            <div style={{ position: 'relative' }}>
              <AnnotationLayer />
              <TileList />
            </div>
          </div>
          {this.state.percent !== 0 && this.state.percent !== 100 &&
          <div className="upload">
            <progress className="progress is-success" value={this.state.percent} max="100">{this.state.percent}%</progress>
          </div>}
        </div>
      </DropzoneS3Uploader>
    );
  }
}

App.propTypes = {
  onFinishUpload: PropTypes.func.isRequired,
  onDropRejected: PropTypes.func.isRequired,
  onDropAccepted: PropTypes.func.isRequired,
};

App.contextTypes = {
  socket: PropTypes.object.isRequired,
};

export default connect()(App);

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import TileList from '../containers/TileList';
import Menubar from '../containers/Menubar';
import UserList from '../containers/UserList';
import Cursors from '../containers/Cursors';
import AnnotationLayer from '../containers/AnnotationLayer';
import Joyride from '../containers/JoyRide';
import { connect } from 'react-redux';
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
  dispatchAndEmit(dispatch, socket, { user, x: e.pageX, y: e.pageY });
};

const App = (props, context) => (
  <DropzoneS3Uploader
    accept="application/pdf, image/*"
    style={{}}
    disableClick
    onDropRejected={rejected => props.onDropRejected(rejected)}
    onFinish={(info) => { props.onFinishUpload(info); console.log(info); }}
    upload={uploadOptions}
    s3Url={S3_URL}
  >
    <div onMouseMove={handleMouseMove(props.dispatch, context.socket)}>
      <Menubar />
      {(window.localStorage.getItem('tourFinished') != 'true') && <Joyride />}
      <UserList />
      <Cursors />
      <div className="workspace">
        <div style={{ position: 'relative' }}>
          <AnnotationLayer />
          <TileList />
        </div>
      </div>
    </div>
  </DropzoneS3Uploader>
);

App.propTypes = {
  onFinishUpload: PropTypes.func.isRequired,
  onDropRejected: PropTypes.func.isRequired,
};

App.contextTypes = {
  socket: PropTypes.object.isRequired,
};

export default connect()(App);


import React from 'react';
import PropTypes from 'prop-types';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import TileList from '../containers/TileList';
import Menubar from '../containers/Menubar';
import UserList from '../containers/UserList';
import AnnotationLayer from '../containers/AnnotationLayer';
import Joyride from '../containers/JoyRide';
import { S3_URL } from '../../credentials';


const uploadOptions = {
  server: 'https://collaborate-app.herokuapp.com',
  s3Url: S3_URL,
};

const App = props => (
  <DropzoneS3Uploader
    accept="application/pdf, image/*"
    style={{}}
    disableClick
    onDropRejected={rejected => props.onDropRejected(rejected)}
    onFinish={(info) => { props.onFinishUpload(info); console.log(info); }}
    upload={uploadOptions}
    s3Url={S3_URL}
  >
    <div>
      <Menubar />
      {(window.localStorage.getItem('tourFinished') != 'true') && <Joyride />}
      <UserList />
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

export default App;


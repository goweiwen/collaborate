import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import TileList from '../containers/TileList';
import Toolbar from '../containers/Menubar';
import AnnotationLayer from '../containers/AnnotationLayer';
import Joyride from './JoyRide';


const onDrop = async (acceptedFiles) => {
  const req = request.post('/upload');
  acceptedFiles.forEach((file) => {
    req.attach('file', file);
  });
  // console.log(await req);
};


const App = () =>
  (<Dropzone
    style={{}}
    disableClick
    onDrop={onDrop}
  >
    <div className="workspace">
      <Joyride />
      <Toolbar />
      <div style={{ width: '100vw', height: 52 }} />
      <AnnotationLayer />
      <TileList />
    </div>
  </Dropzone>);


export default App;


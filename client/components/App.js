import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import TileList from '../containers/TileList';
import Toolbar from '../containers/Toolbar';

const onDrop = async (acceptedFiles) => {
  const req = request.post('/upload');
  acceptedFiles.forEach((file) => {
    req.attach('file', file);
  });
  // console.log(await req);
};

const App = () => (
  <Dropzone
    style={{}}
    disableClick
    onDrop={onDrop}
  >

    <div className="workspace">

      <Toolbar />
      <TileList />
    </div>
  </Dropzone>
  );


export default App;


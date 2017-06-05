import React from 'react';
import TileList from '../containers/TileList';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const onDrop = async (acceptedFiles) => {
  const req = request.post('/upload');
  acceptedFiles.forEach((file) => {
    req.attach('file', file);
  });
  // const src = await req;
  // addTile({ ...
};

const App = () =>
  <Dropzone
    style={{}}
    disableClick
    onDrop={onDrop}
  >
    <div className='workspace'>
      <TileList />
    </div>
  </Dropzone>;




export default App;

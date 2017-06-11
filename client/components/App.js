import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import TileList from '../containers/TileList';

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
      <TileList />
    </div>
  </Dropzone>
  );


export default App;

/* <Grid>
      <Grid.Column>
          <SideMenu/>
      </Grid.Column>
      <div style={{ marginLeft: '250px' }}>
        <Grid.Column>
          <Container style={{ padding: '3em 3em' }}>
            <TileList {...props}/>
          </Container>
        </Grid.Column>
      </div>
      <Grid.Column>
        <ChatContainer/>
      </Grid.Column>
    </Grid>*/


import React from 'react';
import TileList from '../containers/TileList';
import Dropzone from 'react-dropzone';
import { Container, Grid } from 'semantic-ui-react';
import SideMenu from './SideMenu';
import request from 'superagent';

import ChatContainer from '../containers/ChatContainer';

const onDrop = async (acceptedFiles) => {
  const req = request.post('/upload');
  acceptedFiles.forEach((file) => {
    req.attach('file', file);
  });
  const src = await req;
  // addTile({ ...
};

const App = () =>
  <Dropzone
    style={{}}
    disableClick
    onDrop={onDrop}
  >
    <Grid>
      <Grid.Column>
          <SideMenu/>
      </Grid.Column>
      <div style={{ marginLeft: '250px' }}>
        <Grid.Column>
          <Container style={{ padding: '3em 3em' }}>
            <TileList />
          </Container>
        </Grid.Column>
      </div>
      <Grid.Column>
        <ChatContainer/>
      </Grid.Column>
    </Grid>
  </Dropzone>;




export default App;

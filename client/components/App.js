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

  console.log(await req);
};

const App = (props, context) => {
  console.log(props)
  return(
  <Dropzone
    style={{}}
    disableClick
    onDrop={onDrop}
  >
    <TileList {...props}/>    
    
  </Dropzone>);
}





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
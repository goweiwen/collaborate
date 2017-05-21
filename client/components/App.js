import React from 'react';
import Workspace from '../containers/Workspace';
import { Container, Grid } from 'semantic-ui-react';
import SideMenu from './SideMenu';

const App = () =>
  <Grid>
  	<Grid.Column>
    	<SideMenu/>
    </Grid.Column>
    

    <div style={{ marginLeft: '250px' }}>
    	<Grid.Column>
      <Container style={{ padding: '3em 3em' }}>
        <Workspace />
      </Container>
      </Grid.Column>
    </div>

  </Grid>;

export default App;
//https://unsplash.it/200/300?image=0
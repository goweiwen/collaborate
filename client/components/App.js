import React from 'react';
import Workspace from '../containers/Workspace';
import { Container } from 'semantic-ui-react';
import Sidebar from './Sidebar';

const App = () =>
  <div>
    <Sidebar />
    <div style={{ marginLeft: '250px' }}>
      <Container style={{ padding: '3em 3em' }}>
        <Workspace />
      </Container>
    </div>
  </div>;

export default App;

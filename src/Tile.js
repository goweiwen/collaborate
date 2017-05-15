import React from 'react';
import { Card } from 'semantic-ui-react';



export default class Tile extends React.Component {
  constructor(props) {
    //console.log(props);
    super(props);
  }

  render() {
    var body = (
      <div>
        <h1 >Title</h1>
        <div className="meta">Description</div>
        <h4>Content</h4>
      </div>  
    );

    return (
      <Card {...this.props}>
        {this.props.children}
        {body}
      </Card>
    );
  }
}



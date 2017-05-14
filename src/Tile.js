import React from 'react';
import { Card } from 'semantic-ui-react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveReactGridLayout = WidthProvider(Responsive);


export default class Tile extends Card {
  constructor(props) {
   
    super(props);

    this.state = {
     props: props
    };

    this.removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };
  }
  render() {/*
    console.log("-------");
    console.log("Tile Properties");
        console.log(this.props);*/
   
   //these are the x and resizable
   var children = React.Children.toArray(this.props.children);
   console.log(this.props)
    

    return (
      <Card 
      {...this.props}>
      {children}
      <h1 >Title</h1>
      <div className="meta">Description</div>
      <h4>Content</h4>
      </Card>
    );
  }
}

//<span className="remove" style={ this.removeStyle }>x</span>
//<span className="remove" style={removeStyle }  onClick={parent.onRemoveSpecificItem.bind(parent, i)}>x</span>
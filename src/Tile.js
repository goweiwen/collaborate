import React from 'react';
import { Card, Container } from 'semantic-ui-react';



export default class Tile extends React.Component {


  render() {
    const Component = (TestComponent)
    var style = {
     /* 

      TODO
      height:this.props.style.height,
      width:this.props.style.width,
*/

    };
    var body = (      
       <Component style={style}>{this.props.children}</Component> 
    );
    
    //every tile's base is a Card
    return (
      <Card {...this.props}>
        {body}
      </Card>
    );
  }
}

class TestComponent extends React.Component{
  render(){
    return(
      <div>
        Items
        <input/>
        {this.props.children}
      </div>
    )  
  }
}


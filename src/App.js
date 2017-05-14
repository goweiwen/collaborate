import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { Container, Grid, Image, Card, Button } from 'semantic-ui-react'
import _ from 'lodash'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {Responsive, WidthProvider} from 'react-grid-layout';
import Tile from './Tile';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

//For Pure Render Mixin
import shallowEqual from 'fbjs/lib/shallowEqual';
function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}



class App extends React.Component {

  constructor() {
    super();
    this.state = {

      mounted: false,
      //generate a set
      items: this.getInitialState().items,
      //store removed items number
      removedItems: [],
      
      //number of tiles (TODO: don't hardcode)
   		count: this.getInitialState().count

    };
  }
	//For Pure Render Mixin
  shouldComponentUpdate = function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  static defaultProps = {
    className: "layout",
    rowHeight: 100,
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}
  };

  // generate 5 items
  getInitialState() {

  	var arr = [0];
    return {

      items: arr.map(function(i, key, list) {
        return {i: i.toString(), x: i * 2, y: 0, w: 2, h: 2,
          add: i === (list.length - 1).toString()};
      }),
      count: arr.length

    };
  }

  // removes a specific item (TODO: functional set state)
  onRemoveSpecificItem(i) {

    this.setState({
      items: _.reject(this.state.items, {i: i}),
      removedItems: this.state.removedItems.concat([i]),
      count: this.state.count-1
    });
  }

  // pass in parent state so that individual buttons can edit state
  // (Unsure if this bad practice)
  createElement(parent) {
    return function(el) {
      // style of x button
      var removeStyle = {
        position: 'absolute',
        right: '2px',
        top: 0,
        cursor: 'pointer'
      };

      var i = el.i;
     /* return (
        <Card key={i} data-grid={el}>
        <span className="text">{i}</span>
        <span className="remove" style={removeStyle }  onClick={parent.onRemoveSpecificItem.bind(parent, i)}>x</span>
        </Card>
      );
      onClick={parent.onRemoveSpecificItem.bind(parent, i)} */

      //pass in a remove button as a child
      var removeOption = <span className="remove" key={i} style={removeStyle}  onClick={parent.onRemoveSpecificItem.bind(parent, i)}>x</span>
      var newChildren = React.Children.toArray(parent.children);
   		newChildren = newChildren.concat([removeOption]);
      
      return (
        <Tile key={i}>{newChildren}</Tile>
        
      );
    }
  }

  // adds item onto workspace
  onAddItem() {

    this.setState(

      function(prev, currProp) {

        var newTile;
        if (prev.removedItems.length === 0) {
        	

          newTile = {
              i: ""+prev.count,
              x: prev.items.length * 2 % (prev.cols || 12),
              y: Infinity, // puts it at the bottom
              w: 2,
              h: 2,
            };

        } else {
          //we have tiles that are between 0 and max number tile that are not rendered
          var num = prev.removedItems.pop();
         

          newTile = //new Tile
            {
              i: ""+(num),
              x: prev.items.length * 2 % (prev.cols || 12),
              y: Infinity, // puts it at the bottom
              w: 2,
              h: 2,

            };
        }

        //update count
        return {
          items: prev.items.concat([newTile]),
          count: prev.count + 1
        }
      }
    );
  }

  onRemoveItem() {

    this.setState(
      (prev, currProp) => {
        //first element is buggy

        //cant go below 0 items
        if(prev.items.length === 0) {
          return{};
        }

        let prevItems = prev.items;
        prevItems.pop();

        return {items: prevItems, count: prev.count-1};

      }
    );
  }

  onBreakpointChange = (breakpoint) => {
    this.setState(
      (prev, currProp) =>{
        return {breakpoint: breakpoint,
          cols: prev.cols};
      }
    );
  };

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
    //this.setState({layout: layout});
  }

  

  render(){
    return(
      <div>
        <Button onClick={this.onAddItem.bind(this)} >Add Tile</Button>
        <Button onClick={this.onRemoveItem.bind(this)}>Delete Highest Num Tile</Button>
        <ResponsiveReactGridLayout
          
          onBreakpointChange={this.onBreakpointChange}
         
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          //useCSSTransforms={this.state.mounted}
        	layout={this.state.items}
        	isDraggable={true}

        >
       {_.map(this.state.items, this.createElement(this))}
          
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

export default App;
// {_.map(this.state.items, this.createElement(this))}
/*{this.generateDOM()}
  }*/
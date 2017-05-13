import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import 'semantic-ui-css/semantic.css';
import { Container, Grid, Image, Card, Button } from 'semantic-ui-react'
import _ from 'lodash'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import shallowEqual from 'fbjs/lib/shallowEqual';


class App extends React.Component {
  
  constructor(){
    super();
    this.state = {
        mounted: false,
        items: this.getInitialState().items,
        shouldComponentUpdate: function (nextProps, nextState) {
          return shallowCompare(this, nextProps, nextState);
        },
        count: 5
     };

  }



  static defaultProps = {
      className: "layout",
      rowHeight: 100,
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}
    };


    getInitialState() {
      return {
        items: [0, 1, 2, 3, 4].map(function(i, key, list) {
          return {i: i.toString(), x: i * 2, y: 0, w: 2, h: 2, 
            add: i === (list.length - 1).toString()};
        }),
        count: 5
      };
    }

    createElement(el) {
      
      var removeStyle = {
        position: 'absolute',
        right: '0px',
        top: 0,
        cursor: 'pointer'
      };
/* onClick={this.onRemoveSpecificItem.bind(this, i)}*/

      var i = el.i;
        return (
          <Button key={i} data-grid={el}>
            <span className="text">{i}</span>
             <span className="remove" style={removeStyle} >x</span>
          </Button>
        );
    }


    onAddItem() {
    /*eslint no-console: 0*/
    //console.log('adding', 'n' + this.state.newCounter);
    console.log(this);

    this.setState(
      
      function(prev, currProp){

        var newTile = //new Tile
              {
                i: ""+prev.count,
                x: prev.items.length * 2 % (prev.cols || 12),
                y: Infinity, // puts it at the bottom
                w: 2,
                h: 2
              };


        return {
          items: prev.items.concat([newTile]),
          count: prev.count+ 1
        }
      }
    );
  }

  onRemoveItem() {
    /*var i = this.state.items.length -1;
      console.log('removing', i);
      this.setState({items: _.reject(this.state.items, {i: i})});*/


      this.setState(
        (prev, currProp) => {
          //first element is buggy
          if(prev.items.length === 0) {
            return{};
          }

          let prevItems = prev.items;



          prevItems.pop();

          return {items: prevItems, count: prev.count-1};

        }
      );
    }


    onRemoveSpecificItem(i) {
    /*var i = this.state.items.length -1;*/
      console.log('removing', i);
      this.setState(
        (prev, currProps)=> {
          return
            {items: _.reject(prev.items, {i: i})}
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
      this.setState({layout: layout});
    }



///*<Button onClick={this.onRemoveItem}>Delete Tile</Button>*/

    render(){
      console.log(this.props);
    return(
      <div>
        <Button onClick={this.onRemoveItem.bind(this)}>Delete Tile</Button>

        <Button onClick={this.onAddItem.bind(this)} >Add Tile</Button>
        <ResponsiveReactGridLayout
            
          {...this.props}
          onBreakpointChange={this.onBreakpointChange}
          /*onLayoutChange={this.onLayoutChange}*/
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          //useCSSTransforms={this.state.mounted}
          
          >

          
          {_.map(this.state.items, this.createElement)}
        </ResponsiveReactGridLayout>
      </div>
    );
    }



}



export default App;

function generateLayout() {

  return _.map(_.range(0, 25), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: _.random(0, 5) * 2 % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}

    /*//adds a new tile to the layout
    //TODO: resolve bug (resizes every tile on addition)
    addTile(){
      this.setState(
        (prev, currProp) => {
          //first element is buggy


          let prevLayouts = prev.layouts;
          let prevLayoutslg = prevLayouts.lg;

          let newLayoutslg = prevLayouts.lg.concat(
            [{
              x: 400,
              y: 200,
              w: 4,
              h: 4,
              i: Math.random().toString(),
              static: Math.random() < 0.05
            }]
          );


          return {layouts: {lg: newLayoutslg}};

        }
      );
    }

    deleteTile(){
      this.setState(
        (prev, currProp) => {
          //first element is buggy


          let prevLayouts = prev.layouts;
          let prevLayoutslg = prevLayouts.lg;

          if(prevLayouts.lg.length === 1) {
            return {layouts: {lg: []}};
          }

          prevLayoutslg.pop();

          return {layouts: {lg: prevLayoutslg}};

        }
      );
    }*/
/*
generateDOM() {
      return _.map(this.state.layouts.lg, function (l, i) {
        i++;
        return (
          <Card key={i} className={l.static ? 'static' : ''} fluid={true} centered={true} raised={true} >
            {l.static ?
              <span className="text" title="This item is static and cannot be removed or resized.">Static - {i}</span>
              : <span className="text">{i}</span>
            }
          </Card>);
      });
    }
*/

  /*onNewLayout = () => {
    this.setState({
      layouts: {lg: []}
    });
  };
*/
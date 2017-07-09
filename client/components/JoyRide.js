import React from 'react';
import Joyride from 'react-joyride';
import Tile from './Tile';
import _ from 'lodash';

const steps = [

  {
    title: 'collaborate!',
    text: 'Welcome to collaborate!, an online collaborative file view and edit web application that supports multiple file types. If you wish to end the tutorial, press skip',
    selector: '#logo',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  
  },

  {
    title: 'Add Tool',
    text: 'Let\'s start by adding a tile! Click on the <i class=\'fa fa-plus\'/> to proceed',
    selector: '#add-tile-button',
    type: 'hover',
    isFixed: true,
    allowClicksThruHole: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
      footer: {
        display: 'none',
      },
    }  
  },


  {
    title: 'Tile Form',
    text: 'Use this form to create tile, you may also drag files onto our app',
    selector: '#tile-form',
    type: 'hover',
    isFixed: true,
    position: 'top',
    allowClicksThruHole: true,
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },

    }  
  },

  {
    title: 'Submit',
    text: 'Submit your tile!',
    selector: '#submit',
    type: 'hover',
    isFixed: true,
    position: 'top',
    allowClicksThruHole: true,
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
      footer: {
        display: 'none',
      },
      
    }  
  },
 
  {
    title: 'Tile',
    text: 'This is a tile',
    selector: '.joyride-tile',
    type: 'hover',
    position: 'top',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  
  },

  {
    title: 'Select Tool',
    text: 'Use this tool to interact with the content of the tiles',
    selector: '.fa-mouse-pointer',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  

  },

  {
    title: 'Drag Tool',
    text: 'Use this tool to drag, resize and remove tiles. Click on the <i class=\'fa fa-arrows\'/> to proceed',
    selector: '#drag',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    allowClicksThruHole: true,
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },

      footer: {
        display: 'none',
      },
    }  
  },

  {
    title: 'Resize Tile',
    text: 'Change the size of the tile!',
    selector: '.joyride-tile',
    type: 'hover',
    position: 'top',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
       footer: {
        display: 'none',
      },
    }
  },

  {
    title: 'Drag Tile',
    text: 'Drag the Tile',
    selector: '.joyride-tile > button',
    type: 'hover',
    position: 'top',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
       footer: {
        display: 'none',
      },
    }
  },

  {
    title: 'Delete Tile',
    text: 'Click the cross to delete the tile',
    selector: '.joyride-tile-button',
    type: 'hover',
    position: 'top',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
       footer: {
        display: 'none',
      },
    }
  },

  {
    title: 'Pen Tool',
    text: 'Use this tool to doodle for your peers to see',
    selector: '.fa-pencil',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  

  },

  {
    title: 'Eraser Tool',
    text: 'Use this tool to erase unwanted doodles',
    selector: '.fa-eraser',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  
  },

  {
    title: 'Logo',
    text: 'Thanks for sitting through the tutorial. If you have any comments, do write it on a text tile on this app!',
    selector: '#logo',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
    style:{
     mainColor: '#46676b', 
     beacon: {
      inner: '#46676b',
      outer: '#46676b'
      },
    }  
  },
  
];


export default class JoyRide extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      runTour: false,
      steps: [],
      showOverlay: true,

    };
  }

  componentDidMount() {
    // this should check for other components to be mounted (probably a boolean from redux to tell if app is loaded)
    // set timeout used for the time being
    setTimeout(() => this.setState(() => ({ runTour: true, steps })), 3000);
  }

    componentDidUpdate(prevProps, prevState) { 
      if(this.state.finished) {
        return;
      }

      if(this.state.showOverlay !== prevState.showOverlay) {
        this.joyride.reset();
        this.joyride.next();
        window.dispatchEvent(new Event('resize'));
        return;
      }

      if(this.joyride.getProgress().index === 0){
        return;
      }

      if(this.props.tool === 'add_tile_form' && this.joyride.getProgress().step.title === 'Add Tool') {
        this.joyride.next();
        return;
      }

      if(this.props.tool === 'select' && this.joyride.getProgress().step.title === 'Submit') {

        if(this.props.tiles.length > prevProps.tiles.length) {
          const id = this.props.tiles[this.props.tiles.length - 1].id;
          this.setState({id});
          const trainingTile = document.getElementById(id);
          trainingTile.classList.add('joyride-tile')
          this.joyride.next();
          return;
        }
      }

      if(this.props.tool === 'drag' && this.joyride.getProgress().step.title === 'Drag Tool') {
        const trainingTile = document.getElementById(this.state.id);
        trainingTile.classList.add('joyride-tile');

        trainingTile.children[2].classList.add('joyride-tile-button');
        this.setState({showOverlay: false});
        return;
      }

      if(this.props.tool === 'drag' && this.joyride.getProgress().step.title === 'Resize Tile') {
        const id = this.state.id;
        if(this.props.layouts[id].width !== prevProps.layouts[id].width || this.props.layouts[id].height !== prevProps.layouts[id].height)
          this.joyride.next();
        return;
      }

      if(this.props.tool === 'drag' && this.joyride.getProgress().step.title === 'Drag Tile') {
        const id = this.state.id;
        if(this.props.layouts[id].x !== prevProps.layouts[id].x || this.props.layouts[id].y !== prevProps.layouts[id].y){
          if(!(this.props.layouts[id].width !== prevProps.layouts[id].width || this.props.layouts[id].height !== prevProps.layouts[id].height)){
             this.joyride.next();
          }
        }
        return;
      }
      if(this.props.tool === 'drag' && this.joyride.getProgress().step.title === 'Delete Tile') {
        if(this.props.layouts[this.state.id] === undefined) {
          this.setState({showOverlay: true});
        }
      }
    
  }

  callback(data) {
    /*console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); // eslint-disable-line no-console
    console.log(data); // eslint-disable-line no-console
*/
    if(data.type === 'finished') {
      this.setState({finished: true});
    }

  }

  render() {
    return (
      <Joyride
          ref={(c) => { this.joyride = c; }}
          steps={this.state.steps}
          run={this.state.runTour} // or some other boolean for when you want to start it
          debug={false}
          callback={this.callback.bind(this)}
          showSkipButton
          showStepsProgress
          autoStart
          showBackButton={false} 
          scrollOffset={55}
          showOverlay={this.state.showOverlay}
          type={'continuous'}
        />);
  }

}

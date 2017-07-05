import React from 'react';
import Joyride from 'react-joyride';


const steps = [

  {
    title: 'collaborate!',
    text: 'Welcome to collaborate!, an online collaborative file view and edit web application that supports multiple file types.',
    selector: '#logo',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
  },

  {
    title: 'Select Tool',
    text: 'Use this tool to interact with the content of the tiles',
    selector: '.fa-mouse-pointer',
    type: 'hover',
    isFixed: true,
    position: 'bottom',

  },

  {
    title: 'Drag Tool',
    text: 'Use this tool to drag, resize and remove tiles',
    selector: '.fa-arrows',
    type: 'hover',
    isFixed: true,
    position: 'bottom',

  },

  {
    title: 'Pen Tool',
    text: 'Use this tool to doodle for your peers to see',
    selector: '.fa-pencil',
    type: 'hover',
    isFixed: true,
    position: 'bottom',

  },

  {
    title: 'Eraser Tool',
    text: 'Use this tool to erase unwanted doodles',
    selector: '.fa-eraser',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
  },

  {
    title: 'Add Tool',
    text: 'Use this tool to add new tiles',
    selector: '.fa-plus',
    type: 'hover',
    isFixed: true,
    position: 'bottom',
  },
];

export default class JoyRide extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      runTour: false,
      steps: [],
    };
  }

  componentDidMount() {
    // this should check for other components to be mounted (probably a boolean from redux to tell if app is loaded)
    // set timeout used for the time being
    setTimeout(() => this.setState(() => ({ runTour: true, steps })), 3000);
  }


  callback(data) {
    console.log('%ccallback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); // eslint-disable-line no-console
    console.log(data); // eslint-disable-line no-console
  }

  render() {
    return (
      <div>
        <Joyride
          ref={(c) => { this.joyride = c; }}
          steps={this.state.steps}
          run={this.state.runTour} // or some other boolean for when you want to start it
          debug={false}
          callback={this.callback}
          showSkipButton
          showStepsProgress
          type={'continuous'}
        />
      </div>);
  }

}

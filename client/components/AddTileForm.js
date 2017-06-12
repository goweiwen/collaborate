import React from 'react';

const defaultState = {
    isActive: false,
    tileType: 'image',
    src: '',
    content: '',
    lockAspectRatio: false,
    height: 300,
    width: 300,
  }


export default class AddTileForm  extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = defaultState;

  }

  handleTypeChange(){
    this.setState((state) => ({tileType: event.target.value}));
  }

  handleSrcChange(){
    this.setState((state) => ({src: event.target.value}));
  }

  handleContentChange(){
    this.setState((state) => ({content: event.target.value}));
  }

  handleLARchange(){
    this.setState((state) => ({lockAspectRatio: !state.lockAspectRatio}));
  }

  handleHeightChange(){
    this.setState((state) => ({height: event.target.value}));
  }

  handleWidthChange(){
    this.setState((state) => ({width: event.target.value}));
  }

  handleToggleActive(){
     this.setState((state) => ({isActive: !state.isActive}));
  }

  submitTile(){
    let tile = {
      tileType: this.state.tileType,
    }

    if(this.state.tileType === 'Text') {
      tile.content = this.state.content;
    } else {
      tile.src = this.state.src;
    }

    let layout = {
      x: 0,
      y: 0,
      width: this.state.width,
      height: this.state.height,
      lockAspectRatio: this.state.lockAspectRatio,
    }


    this.props.submitTile(tile, layout);
    this.setState((state)=>(defaultState));
  }

  cancel(){
    this.setState((state)=>(defaultState));
  }

  render() {
    const modalActive = (this.state.isActive) ? 'modal is-active' : 'modal';

    let type = 
      (<div className='field'>
        <label className='label'>Tile Type</label>
        <p className='control is-expanded'>
          <span className='select is-fullwidth'>
            <select value={this.state.tileType} onChange={this.handleTypeChange.bind(this)}>
              <option value='image'>Image</option>
              <option value='text'>Text</option>
              <option selected value='youTube'>YouTube</option>
              <option value='googledoc'>GoogleDoc</option>
            </select>
          </span>
        </p>
      </div>);


    let srcDisabled = false;
    if(this.state.tileType === 'Text') {
      srcDisabled = true;
    } 
    
    let src =  
     (<div className='field'>
        <label className='label'>Source</label>
        <p className='control'>
          <input className='input' value={this.state.src} type='text' placeholder='Source' onChange={this.handleSrcChange.bind(this)} disabled={srcDisabled}/>
      </p>
      </div>);

    let contentDisabled = true;
    
    if(this.state.tileType ==='Text') {
      contentDisabled = false;  
    }

    let content =  
     (<div className='field'>
        <label className='label'>Content</label>
        <p className='control'>
          <input className='input' value={this.state.content} type='text' placeholder='Content' onChange={this.handleContentChange.bind(this)} disabled={contentDisabled}/>
      </p>
      </div>);

    let heightSuccess = (this.state.height%50 === 0 && this.state.height >= 300 && this.state.height <= 1000) ?
      (<p className='help is-success'> This Height is valid</p>) : 
      (<p className='help is-danger'> Height must be multiple of 50, and in between 300 and 1000 </p>);

    let height = 
      (<div className='field'>
        <label className='label'>Height</label>
        <p className='control'>
          <input className='input' 
          value={this.state.height} 
          type='number' 
          onChange={this.handleHeightChange.bind(this)}
          step={50}
          min={0}
          max={1000}/>
        </p>
        {heightSuccess}
      </div>);
    
    let widthSuccess = (this.state.width%50 === 0 && this.state.width >= 300 && this.state.width <= 1000) ?
      (<p className='help is-success'> This Width is valid</p>) : 
      (<p className='help is-danger'> Width must be multiple of 50, and in between 300 and 1000 </p>);

    let width = 
      (<div className='field'>
        <label className='label'>Width</label>
        <p className='control'>
          <input className='input' 
          value={this.state.width} 
          type='number' 
          onChange={this.handleWidthChange.bind(this)}
          step={50}
          min={300}
          max={1000}/>
        </p>
        {widthSuccess}
      </div>);  

    let LAR =
      (<div className='field'>
        <p className='control'>
          <label className='checkbox'>
            <input type='checkbox' onChange={this.handleLARchange.bind(this)} checked={this.state.lockAspectRatio}/>
            Lock Aspect Ratio?
          </label>
        </p>
      </div>);

    let submit = 
    (<div className='field is-grouped'>
        <p className='control'>
          <button className='button is-primary' onClick={this.submitTile.bind(this)}>Add Tile</button>
        </p>
        <p className='control'>
          <button className='button is-link' onClick={this.cancel.bind(this)}>Cancel</button>
        </p>
      </div>)  

    return (
      <div>
        <button onClick={this.handleToggleActive.bind(this)}> Add Tile Form</button>
        <div className={modalActive}>
          <div className='modal-background'></div>
          
          <div className='modal-card'>
            <div className='modal-card-body'>
              {type}
              {src}
              {content}
              {height}
              {width}
              {LAR}
              {submit}
            </div>
          </div> 
        </div>
      </div>
    );
     

  }
}
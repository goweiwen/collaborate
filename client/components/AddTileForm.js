import React from 'react';
import PropTypes from 'prop-types';


const defaultState = {
  isActive: false,
  tileType: 'image',
  src: '',
  content: '',
  lockAspectRatio: false,
  height: 300,
  width: 300,
};


export default class AddTileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  handleTypeChange() {
    this.setState(() => ({ tileType: event.target.value }));
  }

  handleSrcChange() {
    this.setState(() => ({ src: event.target.value }));
  }

  handleContentChange() {
    this.setState(() => ({ content: event.target.value }));
  }

  handleLARchange() {
    this.setState(state => ({ lockAspectRatio: !state.lockAspectRatio }));
  }

  handleHeightChange() {
    this.setState(() => ({ height: event.target.value }));
  }

  handleWidthChange() {
    this.setState(() => ({ width: event.target.value }));
  }

  handleToggleActive() {
    this.setState(state => ({ isActive: !state.isActive }));
  }

  submitTile() {
    const tile = {
      tileType: this.state.tileType,
    };

    if (this.state.tileType === 'text') {
      tile.content = this.state.content;
    } else {
      tile.src = this.state.src;
    }

    const layout = {
      x: 0,
      y: 0,
      width: this.state.width,
      height: this.state.height,
      lockAspectRatio: this.state.lockAspectRatio,
    };

    this.props.submitTile(tile, layout);
    this.setState(() => (defaultState));
  }

  cancel() {
    this.setState(() => (defaultState));
  }

  render() {
    const modalActive = (this.state.isActive) ? 'modal is-active' : 'modal';

    const type =
    (<div className="field">
      <label className="label" htmlFor="Tile Type">Tile Type</label>
      <p className="control is-expanded" id="Tile Type">
        <span className="select is-fullwidth">
          <select value={this.state.tileType} onChange={this.handleTypeChange.bind(this)}>
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option selected value="youtube">YouTube</option>
            <option value="googledoc">GoogleDoc</option>
          </select>
        </span>
      </p>
    </div>);


    let srcDisabled = false;
    if (this.state.tileType === 'text') {
      srcDisabled = true;
    }

    const src =
    (<div className="field">
      <label className="label" htmlFor="Source">Source</label>
      <p className="control" id="Source">
        <input className="input" value={this.state.src} type="text" placeholder="Source" onChange={this.handleSrcChange.bind(this)} disabled={srcDisabled} />
      </p>
    </div>);

    let contentDisabled = true;

    if (this.state.tileType === 'text') {
      contentDisabled = false;
    }

    const content =
    (<div className="field">
      <label className="label" htmlFor="Content">Content</label>
      <p className="control" id="Content">
        <input className="input" value={this.state.content} type="text" placeholder="Content" onChange={this.handleContentChange.bind(this)} disabled={contentDisabled} />
      </p>
    </div>);

    const heightSuccess = (this.state.height % 50 === 0 && this.state.height >= 300 && this.state.height <= 1000) ? (<p className="help is-success"> This Height is valid</p>) :
      (<p className="help is-danger"> Height must be multiple of 50, and in between 300 and 1000 </p>);

    const height =
      (<div className="field">
        <label className="label" htmlFor="Height">Height</label>
        <p className="control" id="Height">
          <input
            className="input"
            value={this.state.height}
            type="number"
            onChange={this.handleHeightChange.bind(this)}
            step={50}
            min={0}
            max={1000}
          />
        </p>
        {heightSuccess}
      </div>);

    const widthSuccess = (this.state.width % 50 === 0 && this.state.width >= 300 && this.state.width <= 1000) ?
      (<p className="help is-success"> This Width is valid</p>) :
      (<p className="help is-danger"> Width must be multiple of 50, and in between 300 and 1000 </p>);

    const width =
      (<div className="field">
        <label className="label" htmlFor="Width">Width</label>
        <p className="control" id="Width">
          <input
            className="input"
            value={this.state.width}
            type="number"
            onChange={this.handleWidthChange.bind(this)}
            step={50}
            min={300}
            max={1000}
          />
        </p>
        {widthSuccess}
      </div>);

    const LAR =
      (<div className="field">
        <p className="control">
          <label className="checkbox" htmlFor="LAR">
            <input type="checkbox" id="LAR" onChange={this.handleLARchange.bind(this)} checked={this.state.lockAspectRatio} />
            Lock Aspect Ratio?
          </label>
        </p>
      </div>);

    const submit =
    (<div className="field is-grouped">
      <p className="control">
        <button className="button is-primary" onClick={this.submitTile.bind(this)}>Add Tile</button>
      </p>
      <p className="control">
        <button className="button is-link" onClick={this.cancel.bind(this)}>Cancel</button>
      </p>
    </div>);

    return (
      <div>
        <button onClick={this.handleToggleActive.bind(this)}> Add Tile Form</button>
        <div className={modalActive}>
          <div className="modal-background" />

          <div className="modal-card">
            <div className="modal-card-body">
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

AddTileForm.propTypes = {
  submitTile: PropTypes.func.isRequired,
};

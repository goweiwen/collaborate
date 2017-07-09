import React from 'react';
import PropTypes from 'prop-types';


const defaultState = {
  tileType: 'image',
  src: '',
  content: '',
  lockAspectRatio: false,
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
   
  handleToggleActive() {
    this.props.useAddTileFormTool();
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
      width: 300,
      height: 300,
      lockAspectRatio: this.state.lockAspectRatio,
    };

    this.props.submitTile(tile, layout);
    this.setState(() => (defaultState));
    this.props.useSelectTool();
  }

  cancel() {
    this.props.useSelectTool();
  }

  render() {
    const modalActive = (this.props.tool === 'add_tile_form') ? 'modal is-active' : 'modal';

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
        <button className="button is-primary" id="submit" onClick={this.submitTile.bind(this)}>Add Tile</button>
      </p>
      <p className="control">
        <button className="button is-link" onClick={this.cancel.bind(this)}>Cancel</button>
      </p>
    </div>);

    return (
      <div className="is-paddingless is-marginless nav-item" >
        <a id="add-tile-button" className={this.props.className} onClick={this.handleToggleActive.bind(this)}><i className="fa fa-plus" />
        </a>
        <div>
          <div className={modalActive}>
            <div className="modal-background" />
            <div className="modal-card" >
              <div className="modal-card-body">
              <div id="tile-form" >
                {type}
                {src}
                {content}
                {LAR}
              </div>
                <br/>
                {submit}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddTileForm.propTypes = {
  submitTile: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  useSelectTool: PropTypes.func.isRequired,
  useAddTileFormTool: PropTypes.func.isRequired,
};

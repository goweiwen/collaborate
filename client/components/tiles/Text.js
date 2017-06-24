import React from 'react';
import PropTypes from 'prop-types';


export default class Text extends React.Component {


  componentWillReceiveProps(nextProps) {
    this.textArea.value = nextProps.content;
  }

  valueChange() {
    const content = this.textArea.value;
    const tile = { id: this.props.id, tileType: 'text', content };
    this.props.updateTile(this.context.socket, tile);
  }

  render() {
    return (
      <textarea
        ref={(textArea) => { this.textArea = textArea; }}
        onKeyUp={this.valueChange.bind(this)}
        onChange={this.valueChange.bind(this)}
        className="textarea is-paddingless"
        style={{ border: 'none', boxShadow: 'none', resize: 'none', height: '100%' }}
      >
        {this.props.content}
      </textarea>);
  }
}

Text.propTypes = {
  content: PropTypes.string.isRequired,
  updateTile: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

Text.contextTypes = {
  socket: PropTypes.object,
};

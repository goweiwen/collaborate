import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export default class Text extends React.Component {

  constructor(props) {
    super(props);
    this.md = new MarkdownIt({
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }

        return ''; // use external default escaping
      },
    });

    this.valueChange = this.valueChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      editing: false,
    };

    this.selectionStart = this.selectionEnd = 0;
  }

  componentWillReceiveProps() {
    this.selectionStart = this.textArea.selectionStart;
    this.selectionEnd = this.textArea.selectionEnd;
  }

  componentDidUpdate() {
    this.textArea.selectionStart = this.selectionStart;
    this.textArea.selectionEnd = this.selectionEnd;
  }

  valueChange() {
    const content = this.textArea.value;
    const tile = { id: this.props.id, content };
    this.props.updateTile(tile);
  }

  handleClick() {
    this.textArea.focus();
    this.setState({ editing: true });
    this.textArea.selectionStart = this.selectionStart;
    this.textArea.selectionEnd = this.selectionEnd;
  }

  handleBlur() {
    this.setState({ editing: false });
    this.selectionStart = this.textArea.selectionStart;
    this.selectionEnd = this.textArea.selectionEnd;
  }

  render() {
    return (
      <div className="tile-wrapper">
        <textarea
          ref={(el) => { this.textArea = el; }}
          onKeyUp={this.valueChange}
          onChange={this.valueChange}
          onBlur={this.handleBlur}
          className="textarea is-paddingless"
          value={this.props.content}
        />
        <div
          ref={(el) => { this.preview = el; }}
          onClick={this.handleClick}
          className="preview content"
          style={this.state.editing ? { display: 'none' } : null}
          dangerouslySetInnerHTML={{ __html: this.md.render(this.props.content)}}
        />
      </div>);
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

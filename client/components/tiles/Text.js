import React from 'react';
import PropTypes from 'prop-types';

const Text = props => <p>{props.content}</p>;

Text.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Text;

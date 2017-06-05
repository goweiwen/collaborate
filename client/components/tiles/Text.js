import React from 'react';
import PropTypes from 'prop-types';

const Text = (props) => <p>{props.content}</p>;

Text.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired
};

export default Text;

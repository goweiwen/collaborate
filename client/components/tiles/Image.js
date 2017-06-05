import React from 'react';
import PropTypes from 'prop-types';

const Image = (props) => <img src={props.src} />;

Image.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};

export default Image;

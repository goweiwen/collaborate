import React from 'react';
import PropTypes from 'prop-types';

const YouTube = (props) =>
  <iframe width='560' height='315'
    src={ `https://www.youtube.com/embed/${props.src}` }
    frameBorder='0' allowFullScreen>
  </iframe>;

YouTube.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};

export default YouTube;

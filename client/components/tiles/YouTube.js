import React from 'react';
import PropTypes from 'prop-types';

const style = {
  //position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

const YouTube = (props) =>

  <iframe
    style={style} 
    src={ `https://www.youtube.com/embed/${props.src}` }
    frameBorder='0' allowFullScreen>
  </iframe>
;

YouTube.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};

export default YouTube;

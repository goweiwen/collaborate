import React from 'react';
import PropTypes from 'prop-types';

const GoogleDoc = (props) => 
  <iframe width={'100%'}
   height={'100%'}
    src ={props.src}></iframe>;

GoogleDoc.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};  
export default GoogleDoc;


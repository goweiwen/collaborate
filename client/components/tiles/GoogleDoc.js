import React from 'react';
import PropTypes from 'prop-types';

const GoogleDocs = (props) => 
  <iframe width={'100%'}
   height={'100%'}
    src ={props.src}></iframe>;
  
export default GoogleDocs;


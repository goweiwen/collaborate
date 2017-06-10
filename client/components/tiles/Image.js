import React from 'react';
import PropTypes from 'prop-types';

const Image = (props) => 
<div style={{position: 'absolute',
  top: 0,
  left: 0,
  width: props.width,
  height: props.height,
  padding: 10,}}>
<img style={{height:'100%', width:'100%'}} src={props.src}/>
</div>
;

Image.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};

export default Image;

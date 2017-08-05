import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../Loader';

const Image = (props) => {
  if (props.src === 'loading') {
    return <Loader width={props.width} height={props.height} />;
  }
  return (<img
    className="collaborate-image"
    alt=""
    style={{ height: props.height, width: props.width }}
    src={props.src}
  />);
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Image;

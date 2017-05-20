import React from 'react';
import PropTypes from 'prop-types';
import { Image as ImageDOM } from 'semantic-ui-react';

const Image = (props) => <ImageDOM src={props.src} />;

Image.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
}

export default Image;

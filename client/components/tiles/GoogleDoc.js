import React from 'react';
import PropTypes from 'prop-types';

const GoogleDoc = props =>
  (<iframe
    title="Google Docs"
    width={'100%'}
    height={'100%'}
    src={props.src}
  />);

GoogleDoc.propTypes = {
  src: PropTypes.string.isRequired,
};
export default GoogleDoc;


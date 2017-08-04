import React from 'react';
import PropTypes from 'prop-types';

const GoogleDoc = props =>
  (<iframe
    title="Google Docs"
    width={'100%'}
    height={'100%'}
    src={props.src}
    sandbox={props.src.substring(0, 24) === 'https://docs.google.com/' ? 'allow-scripts allow-forms allow-same-origin' : ''}
  />);

GoogleDoc.propTypes = {
  src: PropTypes.string.isRequired,
};
export default GoogleDoc;


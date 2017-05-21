import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const YouTube = (props) =>
  <Container as='iframe' width='560' height='315'
    src={ `https://www.youtube.com/embed/${props.src}` }
    frameBorder='0' allowFullScreen>
  </Container>;

YouTube.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired
};

export default YouTube;

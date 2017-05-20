import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const Text = (props) =>
  <Card.Content>
    {props.content}
  </Card.Content>;

Text.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired
};

export default Text;

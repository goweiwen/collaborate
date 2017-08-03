import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const _user = user;

const Cursors = props => (
  <div className="cursor-list">
    {_.map(Object.keys(props.users), user => (
      user !== _user &&
      <div
        className="cursor"
        key={user}
        style={{
          border: '10px solid transparent',
          borderBottomColor: props.users[user].colour,
          transform: `translate(${props.users[user].x}px, ${props.users[user].y}px)`,
        }}
      />
    ))}
  </div>
);

Cursors.propTypes = {
  users: PropTypes.object.isRequired,
};

export default Cursors;

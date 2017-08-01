import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const UserList = props => (
  <div className="user-list">
    {_.map(Object.keys(props.users), user => (
      <div className="user" key={user}>
        <img className="user-photo" src={props.users[user].photo} key={user} />
        <span className="user-name">{user}</span>
      </div>
    ))}
  </div>
);

UserList.propTypes = {
  users: PropTypes.object.isRequired,
};

export default UserList;

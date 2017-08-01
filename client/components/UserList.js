import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const listStyle = {
  position: 'absolute',
  bottom: 0,
  right: 0,
};

const userStyle = {
  
};

const UserList = (props) => {
  console.log(props)
  return <div style={listStyle}>
    {_.map(Object.keys(props.users), user => <div style={userStyle} key={user}>{user}</div>)}
  </div>
};

UserList.propTypes = {
  users: PropTypes.object.isRequired,
};

export default UserList;

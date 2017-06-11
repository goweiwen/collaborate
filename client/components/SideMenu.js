import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSideMenu } from '../../actions';

const mapStateToProps = state => ({ side_menu_visible: state.side_menu_visible });
const mapDispatchToProps = dispatch => ({
  toggleSideMenu: () => {
    dispatch(toggleSideMenu());
  },
});

const SideMenu = props => (
  <div
    onMouseEnter={props.toggleSideMenu}
    onMouseLeave={props.toggleSideMenu}
    style={{ width: '250px', height: '20%' }}
  >
    <div style={{ width: '250px' }} />
  </div>
);

SideMenu.propTypes = {
  toggleSideMenu: PropTypes.function.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

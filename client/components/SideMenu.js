import React from 'react';
import { connect } from 'react-redux';
import { toggleSideMenu } from '../../actions';

const mapStateToProps = (state) => ({side_menu_visible: state.side_menu_visible});
const mapDispatchToProps = (dispatch) =>  ({
  toggleSideMenu: () => {
    dispatch(toggleSideMenu());
  }
});

const SideMenu = (props) => (
  <div onMouseEnter={props.toggleSideMenu} onMouseLeave={props.toggleSideMenu} style={{ width: '250px', height: '20%' }}>
    <div style={{ width: '250px' }}>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

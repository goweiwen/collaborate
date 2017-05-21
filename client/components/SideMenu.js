import React from 'react';
import { Sidebar, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { toggleSideMenu } from '../../actions';

const mapStateToProps = (state) => ({side_menu_visible: state.side_menu_visible});
const mapDispatchToProps = (dispatch) =>  ({
  toggleSideMenu: () => {
    dispatch(toggleSideMenu());
  }
});

const SideMenu = (props) =>
  (
    <div onMouseEnter={props.toggleSideMenu} onMouseLeave={props.toggleSideMenu} style={{ width: '250px', height: '20%' }}>
      <Sidebar visible={props.side_menu_visible} inverted vertical as={Menu} style={{ width: '250px' }}>
        <Menu.Item>Menu</Menu.Item>
        <Menu.Item></Menu.Item>
      </Sidebar>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

import React from 'react';
import { Button, Sidebar, Segment, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { toggleSideMenu } from '../../actions';

const mapStateToProps = (state) => ({side_menu_visible: state.side_menu_visible});
const mapDispatchToProps = (dispatch) => ({
	toggleSideMenu: () => {
		dispatch(toggleSideMenu());
	}
})


const SideMenu = (props) =>
  (	<div onMouseEnter={props.toggleSideMenu} onMouseLeave={props.toggleSideMenu} animation='overlay' style={{ width: '250px', height: '20%' }}>
  
  	<Sidebar  visible={props.side_menu_visible} inverted vertical as={Menu} style={{ width: '250px' }}>
  		<Menu.Item>Test</Menu.Item>
  		<Menu.Item></Menu.Item>
  	</Sidebar>

  	</div>
);

//export default SideMenu;

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

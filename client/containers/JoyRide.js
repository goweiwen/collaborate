import { connect } from 'react-redux';
import JoyRide from '../components/JoyRide';

const mapStateToProps = state => ({ tool: state.tool, tiles: state.tiles, layouts: state.layouts });

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(JoyRide);

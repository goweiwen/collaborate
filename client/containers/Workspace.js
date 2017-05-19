import { connect } from 'react-redux';
import TileList from '../components/TileList';

const mapStateToProps = (state) => ({tiles: state.tiles});

export default connect(mapStateToProps)(TileList);

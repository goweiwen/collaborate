import { connect } from 'react-redux';
import Tile from '../components/Tile';

const mapStateToProps = (state, props) =>
  ({ ...props, tile: state.tiles.filter(tile => tile.id === props.id)[0] });

export default connect(mapStateToProps)(Tile);

import { connect } from 'react-redux';
import Cursors from '../components/Cursors';

const mapStateToProps = state => ({ users: state.users });

export default connect(mapStateToProps)(Cursors);

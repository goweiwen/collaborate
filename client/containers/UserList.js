import { connect } from 'react-redux';
import UserList from '../components/UserList';

const mapStateToProps = state => ({ users: state.users });

export default connect(mapStateToProps)(UserList);

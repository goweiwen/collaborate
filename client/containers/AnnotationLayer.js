import { connect } from 'react-redux';
import { updateAnnotation, UPDATE_ANNOTATION } from '../../actions';
import AnnotationLayer from '../components/AnnotationLayer';

const mapStateToProps = state => ({ annotation: state.annotation });

const mapDispatchToProps = dispatch => ({
  updateAnnotation: (socket, dataURL) => {
    socket.emit(UPDATE_ANNOTATION, dataURL);
    dispatch(updateAnnotation(dataURL));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationLayer);

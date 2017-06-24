import { connect } from 'react-redux';
import { updateAnnotation, UPDATE_ANNOTATION, usePenTool, useEraserTool } from '../../actions';
import AnnotationLayer from '../components/AnnotationLayer';

const mapStateToProps = state => ({ annotation: state.annotation, tool: state.tool });

const mapDispatchToProps = dispatch => ({
  updateAnnotation: (socket, dataURL) => {
    socket.emit(UPDATE_ANNOTATION, dataURL);
    dispatch(updateAnnotation(dataURL));
  },

  usePenTool: () => dispatch(usePenTool()),

  useEraserTool: () => dispatch(useEraserTool()),

});

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationLayer);

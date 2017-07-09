import _ from 'lodash';
import { connect } from 'react-redux';
import JoyRide from '../components/JoyRide';
import { useSelectTool, useDragTool, usePenTool, useEraserTool, usePenColorTool,} from '../../actions';

const mapStateToProps = state => ({ tool: state.tool, tiles: state.tiles, layouts: state.layouts });

const mapDispatchToProps = dispatch => ({

  useSelectTool: () => {
    dispatch(useSelectTool());
  },

  useDragTool: () => {
    dispatch(useDragTool());
  },

  usePenTool: () => {
    dispatch(usePenTool());
  },

  useEraserTool: () => {
    dispatch(useEraserTool());
  },

  usePenColorTool: (color) => {
    dispatch(usePenColorTool(color));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(JoyRide);

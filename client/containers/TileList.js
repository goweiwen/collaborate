import { connect } from 'react-redux';
import TileList from '../components/TileList';
import { addTile, removeTile, updateTile, updateLayout } from '../../actions';

const mapStateToProps = (state) => ({tiles: state.tiles, layouts: state.layouts});

const mapDispatchToProps = (dispatch) => ({
  addTile: (socket, id) => {
    //const tile = { tileType: 'image', src: `https://unsplash.it/200/300?image=${id}`, layout: {x:0, y:300, height:'300px', width: '300px'} };
    const tile = { tileType: 'image', src: '',};
    const layout = {x:0, y:300, height:300, width: 300}; 
    socket.emit('update layout', layout, id);
    socket.emit('add', tile, id);
    dispatch(updateLayout(layout, id));
    dispatch(addTile(tile, id));
    
  },
  removeTile: (socket, id) => {
    socket.emit('remove', id);
    dispatch(removeTile(id));
    dispatch(updateLayout(undefined, id));
  },
  updateTile: (socket, tile) => {
    socket.emit('update tile', tile);
    dispatch(updateTile(tile));
  },

  updateLayout: (socket, layout, id) => {
    socket.emit('update layout', layout, id);
    dispatch(updateLayout(layout, id));
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(TileList);

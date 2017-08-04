import React from 'react';

const Loader = (props) => {

  const { width, height } = props;
  const outerStyle = {
    position: 'relative', 
    width,
    height,
  }

  return <div style={outerStyle}><div className="loader"></div></div>
}

export default Loader;
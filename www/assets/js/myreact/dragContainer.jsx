import React from 'react';

import DropArea from './dropArea.jsx';
import DragTarget from './dragTarget.jsx';



class AppDragContainer extends React.Component {
  render () {
    return (     
	    <div className="wrapAll">  
	    	<h1>Wrap All</h1>           
			<DropArea name="dropArea"/> 
			<DragTarget name="dragTarget"/> 
        </div>        
    );
  }
}

export default AppDragContainer;
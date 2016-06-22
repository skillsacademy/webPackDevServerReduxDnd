import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext } from 'react-dnd';

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

function wrapDragContext(child) {
	return DragDropContext(HTML5Backend)(child);
}


export default wrapDragContext(AppDragContainer);
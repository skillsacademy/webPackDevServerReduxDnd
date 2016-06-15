import React from 'react';
import {render} from 'react-dom';

import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext } from 'react-dnd';

import DropArea from './dropArea.jsx';
import DragTarget from './dragTarget.jsx';



class AppDragContainer extends React.Component {
  render () {
    return (     
	    <div className="wrapAll">  
	    	<h1>Wrap All</h1>           
			<DropArea pagename={this.props.pagename} name="dropArea"/> 
			<DragTarget pagename={this.props.pagename} name="dragTarget"/> 
        </div>        
    );
  }
}

function wrapDragContext(child) {
	return DragDropContext(HTML5Backend)(child);
}


export default wrapDragContext(AppDragContainer);
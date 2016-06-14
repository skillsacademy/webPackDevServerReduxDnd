import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';

import HTML5Backend from 'react-dnd-html5-backend';
import {DropTarget} from 'react-dnd';

const spec = {
	drop(){
		return {
			name: 'DropArea'
		};
	}
}


let collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	}
};

class AppDropArea extends React.Component {
  render () {
  	const { canDrop, isOver, connectDropTarget} = this.props;
  	const isActive = canDrop && isOver;
  	let bg = '#efefef';

  	if(isActive){
  		bg = '#f00'
  	}else if(canDrop){
  		bg = '#ff0'
  	}

  	const style = {
  		backgroundColor:bg
  	};

    return (    
    	connectDropTarget( 
		    <div className="dropArea" style={style}>
		    	{
		    		isActive? 'dropped': 'open'
		    	}
	        </div>  
        )      
    );
  }
}

AppDropArea.propTypes = {
	connectDropTarget:PropTypes.func.isRequired,
	isOver: PropTypes.bool.isRequired,
	canDrop: PropTypes.bool.isRequired
}



export default DropTarget('dropTargetX',spec, collect)(AppDropArea);
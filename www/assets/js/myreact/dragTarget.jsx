import React, {Component, PropTypes} from 'react';
import { render } from 'react-dom';
import { DragSource } from 'react-dnd';

class AppDragTarget extends Component{

	constructor /* function */ (props) {
		super(props);
	}

	_onMouseDown /* function */(){	

	}	

	render /*function*/ () {    
		const { name, connectDragSource, isDragging } = this.props;	
		return (
			connectDragSource(
				<div className='dragTarget' 
					style={{ opacity: isDragging ? 0.5 : 1 }} 
					onMouseDown={this._onMouseDown.bind(this)} >
					Drag me somewhere
				</div>		
			)
    	)
  	} 	
};
AppDragTarget.propTypes = {
	connectDragSource: PropTypes.func.isRequired,
	isDragging: PropTypes.bool. isRequired,
	name: PropTypes.string.isRequired
}


function wrapDragTarget(child, dragTargetName) {
	const spec = {
	  beginDrag(props) {
	    return {
	    	name:props.name
	    };
	  },
	  endDrag(props, monitor){
	  	const dragItem = monitor.getItem();
	  	const dropResult = monitor.getDropResult();
	  	if(dropResult){
	  		console.log('you dropped ${dragItem.name} into ${dragResult.name}');
	  	}
	  }  
	};
	const collect = (connect, monitor) =>{
	  return {
	    connectDragSource: connect.dragSource(),
	    isDragging: monitor.isDragging()
	  };
	}	
	return DragSource(dragTargetName, spec, collect)(child);
}

export default wrapDragTarget(AppDragTarget, 'dragTargetX');
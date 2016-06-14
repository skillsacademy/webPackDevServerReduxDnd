import React, {Component, PropTypes} from 'react';
import { render } from 'react-dom';
import { DragSource } from 'react-dnd';

// drag stuff here....
let collect = (connect, monitor) =>{
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

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

class AppDragTarget extends Component{
	render(){   
		const { name, connectDragSource, isDragging } = this.props;	
		return (
			connectDragSource(

				<div className='dragTarget' style={{ opacity: isDragging ? 0.5 : 1 }}>
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

export default DragSource('dropTargetX', spec, collect)(AppDragTarget);
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';

const LEFT_BUTTON = 0;
const DRAG_THRESHOLD = 3;




class AppDragTarget extends Component{

	constructor /* function */ (props) {
		super(props);

		this.state = {
			mouseDown: false,
			originX: 0,
			originY: 0,
			elementX: 0,
			elementY: 0,
			hasDraggeed:false		
		};		

		// Preserve this context
		//this._onMouseMove = this._bodyOnMouseMove.bind(this);		
		//this._onMouseUp = this._bodyOnMouseUp.bind(this);		
	}
	componentWillUmount(){	
		this.killBodyEvents();
	}
	addBodyEvents(){
		document.addEventListener('drag', this, false);		
		document.addEventListener('dragend', this, false);
	}	
	_onMouseDown /* function */(event){	

		console.log('! elem mouse down');		

		var pageOffset;
		if (event.button === LEFT_BUTTON) {
			event.stopPropagation();
			pageOffset = ReactDOM.findDOMNode(event.target).getBoundingClientRect();

			// asynchronous method!
			this.setState({
				mouseDown: true,
				originX: event.pageX,
				originY: event.pageY,
				elementX: pageOffset.left,
				elementY: pageOffset.top
			},function(){		
				// console.log(this.state.originX) === value				
				this.addBodyEvents();				
			});

			// console.log(this.state.originX) === null	
		}
	}	

	killBodyEvents(){
		document.removeEventListener('drag', this, false);
		document.removeEventListener('dragend', this, false);
	}

	handleEvent(evt){
		// this is triggered from all event listeners provided the 'this' keyword.	
		var strEvt = (evt.type ==='drag')?'_bodyOnDrag':'_bodyOnDragEnd';
		this[strEvt](evt);
	}
	_bodyOnDragEnd (event){	
		
		console.log('body drag end !');	
		this.killBodyEvents();
/*
		var pageOffset;
		if (event.button === LEFT_BUTTON && this.state.mouseDown) {
console.log('body mouse up AND mousedown !');				
			event.stopPropagation();
			this.setState({
				mouseDown: false,
				dragging: false
			});
		}*/
	}
	_bodyOnDrag (event){	

console.log('body mouse drag');	

/*
		if(this.state.mouseDown){
console.log('body mouse move AND MOUSE DOWN !');			
			var base, base1, deltaX, deltaY, distance;
			deltaX = event.pageX - this.state.originX;
			deltaY = event.pageY - this.state.originY;
			distance = Math.abs(deltaX) + Math.abs(deltaY);

			if (!this.state.dragging && distance > DRAG_THRESHOLD) {
				this.setState({
					dragging: true
				});
			}
			if (this.state.dragging) {
				this.setState({
					left: this.state.elementX + deltaX + document.body.scrollLeft,
					top: this.state.elementY + deltaY + document.body.scrollTop,
					hasDragged: true
				});
			}
		}*/
		
	}	
	render /*function*/ () {    
		const { name, connectDragSource, isDragging } = this.props;	

		var style = {};
		if (this.state.hasDragged) {
			style = {
				position: 'absolute',
				left: this.state.left + 'px',
				top: this.state.top + 'px'
			};
		}

		return (
			connectDragSource(
				<div className='dragTarget' 
					style={style} 
					onMouseDown={this._onMouseDown.bind(this)}
					 >
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
	let spec = {
	  beginDrag(props) {
	    return {
	    	name:props.name
	    };
	  },
	  endDrag(props, monitor){
	  	const dragItem = monitor.getItem();
	  	const dropResult = monitor.getDropResult();
	  	

	  	if(dropResult){
	  		console.log('you dropped ' + dragItem.name + ' into ' + dropResult.name);
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
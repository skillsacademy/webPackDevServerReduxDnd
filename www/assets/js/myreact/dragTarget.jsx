import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { DragSource } from 'react-dnd';

const LEFT_BUTTON = 0;
const DRAG_THRESHOLD = 3;

class AppDragTarget extends Component{

	constructor /* function */ (props) {
		super(props);	

		this.state = {
			dragging: false,
			rel: null // position relative to the cursor
		}

	}

	_onDragStart /* function */(event){	

		// only left mouse button
		//if (event.button !== 0){
	//		return
//		}


		var elemOffset = ReactDOM.findDOMNode(event.target).getBoundingClientRect();
		var startEvtX = event.pageX || event.targetTouches[0].pageX;
		var startEvtY = event.pageY || event.targetTouches[0].pageY;

		return this.setState({
			mousedown: true,
			startEvtX: startEvtX,
			startEvtY: startEvtY,
			elementX: elemOffset.left,
			elementY: elemOffset.top			
		})

	}	
	_onDragEnd (event){	
		event.preventDefault();		 // needed to prevent normal device scrolling during drag
		return this.setState({
			dragging: false
		});

	}

	_onDragMove (event){	
		event.preventDefault(); // needed to prevent normal device scrolling during drag

		var base, base1, deltaX, deltaY, distance;
		var evtX = event.pageX || event.targetTouches[0].pageX;
		var evtY = event.pageY || event.targetTouches[0].pageY;


		deltaX = evtX - this.state.startEvtX;
		deltaY = evtY - this.state.startEvtY;
		distance = Math.abs(deltaX) + Math.abs(deltaY);


		if (!this.state.dragging && distance > DRAG_THRESHOLD) {
			
			return this.setState({
			  dragging: true
			});
		}

		if (this.state.dragging) {	

			var left = this.state.elementX + deltaX + document.body.scrollLeft;
			var top = this.state.elementY + deltaY + document.body.scrollTop;

			return this.setState({
				left: left,
				top: top
			});
		}



	}
	
	render /*function*/ () {    
		const { name, connectDragSource, isDragging } = this.props;	

		var style = {};
		if (this.state.dragging && this.state.left) {
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

					onMouseDown={this._onDragStart.bind(this)}
					onTouchStart={this._onDragStart.bind(this)}

					onTouchMove={this._onDragMove.bind(this)}
					onDrag={this._onDragMove.bind(this)}


					onDragEnd={this._onDragEnd.bind(this)}
					onTouchEnd={this._onDragEnd.bind(this)}
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

AppDragTarget.defaultProps = {	
	initialPos:{		
		x: 0, 
		y: 0
	}	
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
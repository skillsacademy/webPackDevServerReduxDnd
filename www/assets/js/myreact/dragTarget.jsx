import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';


const LEFT_BUTTON = 0;
const DRAG_THRESHOLD = 3;



class AppDragTarget extends Component{

	constructor /* function */ (props) {
		super(props);	

		this.state = {
			currentState: 'default',
			left: null,
			top: null,			
			useful:{
				startEvtX:null,
				startEvtY:null,
				elementX: null,
				elementY: null
			}
		}

	}

	getLeftTop(event){

		var deltaX, deltaY, distance, left, top, eventCursor, evtX, evtY;

		var eventCursor = event;
		if(event.targetTouches || event.changedTouches){
			eventCursor = (typeof event.targetTouches.length > 0)?event.targetTouches[0]:event.changedTouches[0];
		}

		var evtX = eventCursor.pageX;
		var evtY = eventCursor.pageY;

		deltaX = evtX - this.state.useful.startEvtX;
		deltaY = evtY - this.state.useful.startEvtY;
		distance = Math.abs(deltaX) + Math.abs(deltaY);

		if (distance > DRAG_THRESHOLD) {			
			var left = this.state.useful.elementX + deltaX + document.body.scrollLeft;
			var top = this.state.useful.elementY + deltaY + document.body.scrollTop;
		}

		return {
			left:left,
			top:top
		}
	}

	_onDragStart /* function */(event){	

		var elemOffset = ReactDOM.findDOMNode(event.target).getBoundingClientRect();
	

		var startEvtX = event.pageX || event.targetTouches[0].pageX;
		var startEvtY = event.pageY || event.targetTouches[0].pageY;




		return this.setState({
			useful:{			
				startEvtX: startEvtX,
				startEvtY: startEvtY,
				elementX: elemOffset.left,
				elementY: elemOffset.top
			}			
		})

	}	
	_onDragEnd (event){		

		var objLt = this.getLeftTop(event);
		var left = objLt.left;
		var top = objLt.top;


		console.log('dropped into? ',document.elementFromPoint(left,top));

		// now re-show the element...
		this.setState({
			currentState:'moved',
			left:left,
			top:top			
		});


	}

	_onDragMove (event){	
		event.preventDefault(); // needed to prevent normal device scrolling during drag

		if(!event.pageX && !event.targetTouches){
			return;
		}

		var objLt = this.getLeftTop(event);

		if (objLt.left) {			

			return this.setState({
				currentState:'dragging',
				left: objLt.left,
				top: objLt.top
			});
		}

	}

	_onDragOver(event){
		// fix icon, and will allow getting the getElementFromPoint on dropped target, 
		event.preventDefault();
	}
	

	render /*function*/ () {    
		var style = {},
		currentState = this.state.currentState;

		if (this.state.left && this.state.top) {		
			var strTranslate = 'translate(' + this.state.left + 'px,' + this.state.top + 'px)';
			style = {
				transform: strTranslate
			};
		}

		return (
			<div id="dragMe" className='dragTarget' 

				style={style} 
				draggable="true"
				data-current-state={currentState}

				onDragStart={this._onDragStart.bind(this)}
				onTouchStart={this._onDragStart.bind(this)}

				onTouchMove={this._onDragMove.bind(this)}
				onDrag={this._onDragMove.bind(this)}


				onDragEnd={this._onDragEnd.bind(this)}
				onTouchEnd={this._onDragEnd.bind(this)}

				onDragOver={this._onDragOver.bind(this)}

				 >
				Drag me somewhere
			</div>		
		
    	)
  	} 	
};

export default AppDragTarget;
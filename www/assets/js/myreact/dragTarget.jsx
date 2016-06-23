import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';


const LEFT_BUTTON = 0;
const DRAG_THRESHOLD = 3;


function getEvtXY(event){
	var eventCursor = event;
	if(event.targetTouches || event.changedTouches){
		eventCursor = (typeof event.targetTouches.length > 0)?event.targetTouches[0]:event.changedTouches[0];
	}		
	return {
		evtX:eventCursor.pageX,
		evtY:eventCursor.pageY
	}	
}

function getLeftTop(evtXY, startEvtX, startEvtY, elementX, elementY){

	var deltaX, deltaY, distance, left, top

	var evtX = evtXY.evtX;
	var evtY = evtXY.evtY;

	deltaX = evtX - startEvtX;
	deltaY = evtY - startEvtY;
	distance = Math.abs(deltaX) + Math.abs(deltaY);

	if (distance > DRAG_THRESHOLD) {			
		var left = elementX + deltaX + document.body.scrollLeft;
		var top = elementY + deltaY + document.body.scrollTop;

		left = (left > 0)?left:0;		
		top = (top > 0)?top:0;	
	}

	return {
		left:left,
		top:top
	}
}

function getDirectionXY(evtXY, startEvtX, startEvtY){
	return {
		directionX:(startEvtX > evtXY.evtX)?'left':'right',
		directionY:(startEvtY > evtXY.evtY)?'top':'bottom'
	}
}

function getDropElements(left, top, width, height){


	var elemTopLeft = document.elementFromPoint(left,top);
	var elemTopRight = document.elementFromPoint(left + width,top);
	var elemBottomRight = document.elementFromPoint(left + width,top + height);
	var elemBottomLeft = document.elementFromPoint(left, top + height);


	var arrDroppedElems = [elemTopLeft];

	if(elemTopRight !== elemTopLeft){
		arrDroppedElems.push(elemTopRight);
	}
	if(elemBottomRight !== elemTopRight && elemBottomRight !== elemTopLeft){
		arrDroppedElems.push(elemBottomRight);
	}
	if(elemBottomLeft !== elemBottomRight && elemBottomLeft !== elemTopRight && elemBottomLeft !== elemTopLeft){
		arrDroppedElems.push(elemBottomLeft);
	}

	var arrDroppedElemsAndChildren = [], elemDroppedOnto, nodeListDescendants, arrDescendants;
	for(var i=0, intLen = arrDroppedElems.length; i < intLen; ++i){
		elemDroppedOnto = arrDroppedElems[i];


		if(elemDroppedOnto && elemDroppedOnto.nodeName !=='HTML'){			

			arrDroppedElemsAndChildren.push(elemDroppedOnto);

			var nodeListDescendants = elemDroppedOnto.querySelectorAll("*");	
			var arrDescendants = Array.prototype.slice.call(nodeListDescendants);

			arrDroppedElemsAndChildren = arrDroppedElemsAndChildren.concat(arrDescendants);
		}
		
	}

	return arrDroppedElemsAndChildren;	
}



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



	_onDragStart /* function */(event){	

		var elemOffset = ReactDOM.findDOMNode(event.target).getBoundingClientRect();
	
		var evtXY = getEvtXY(event);
		var startEvtX = evtXY.evtX;
		var startEvtY = evtXY.evtY;

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

		var evtXY = getEvtXY(event);
		var startEvtX = this.state.useful.startEvtX;
		var startEvtY = this.state.useful.startEvtY;
		var elementX = this.state.useful.elementX;
		var elementY = this.state.useful.elementY;

		var objLt = getLeftTop(evtXY, startEvtX, startEvtY, elementX, elementY);
		var left = objLt.left;
		var top = objLt.top;

		var directionXY = getDirectionXY(evtXY, startEvtX, startEvtY);
		var element = ReactDOM.findDOMNode(event.target);

		var width = parseInt(element.offsetWidth, 10);
		var height = parseInt(element.offsetHeight, 10);



		return this.setState({
			currentState:'tempDropped'

		}, function(){

			var arrDroppedElems = getDropElements(left, top, width, height);

console.log('arrDroppedElems = ');
console.dir(arrDroppedElems);			

			// now re-show the element...
			this.setState({
				currentState:'moved',
				left:left,
				top:top			
			});

		});
	}

	_onDragMove (event){	
		event.preventDefault(); // needed to prevent normal device scrolling during drag

		if(!event.pageX && !event.targetTouches){
			return;
		}

		var evtXY = getEvtXY(event);
		var startEvtX = this.state.useful.startEvtX;
		var startEvtY = this.state.useful.startEvtY;
		var elementX = this.state.useful.elementX;
		var elementY = this.state.useful.elementY;

		var objLt = getLeftTop(evtXY, startEvtX, startEvtY, elementX, elementY);

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
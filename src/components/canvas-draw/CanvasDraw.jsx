import React from 'react';
import classNames from 'classnames';
import './CanvasDraw.scss';
import { cloneDeep, range, size, map, flatten, random, tail, head }  from 'lodash';
//import Picker from 'react-emojipicker';

class CanvasDraw extends React.Component {
    constructor( props ) {
        super( props );
        
        this.state = {
    		assets_loaded: false,
    		mousedown_pos: null,
    	};
    }
	componentWillMount() {
		this.static = {
			asset_list: []

		};
	}

/*----------------------- initialization and asset loading -----------------------*/

	componentDidMount() {
		this.ctx = this.canvas.getContext("2d");
	}

	componentDidUpdate() {
		this.render_canvas();
	}

/*----------------------- core drawing routines -----------------------*/
	render_canvas = () => {
		let { assets, asset_list, assets_meta } = this.static;
		let { sticker_name_to_be_placed, ghost_sticker } = this.state;
		this.fill_canvas_with_solid_color();
	}

	fill_canvas_with_solid_color = () => {
		this.ctx.save();
		this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.restore();
	}

/*----------------------- event handling -----------------------*/
	/*
		The big-picture view of event-handling in this app is that, to prevent event dropping, we do almost no event-handling in the actual sticker objects themselves - everything about tracking the mouse when you're doing an operation is handled on the main canvas itself.  The one thing we track in the stickers themselves is the act of *starting* an event; of recording which event is being performed.  I.e. if you click on one of the rotate grabbers and start rotating an image, we'll use that to record (in this, the parent object) that a rotation event has started, but all of the actual tracking of the movement of the mouse (ergo, of what angle you're rotating to, and when you let go of the mouse) happens here.

		Events, like in photoshop, are modal; once you start rotating an image, the program is essentially 'locked' into a rotation mode until you let go of the mouse.  Because of this, we handle everything basically as a central 'switchboard', right here.
	*/

	track_canvas_move = ( e ) => {
		var mousePosUnconstrained = this.get_mouse_pos_for_action(e, false);
		var mousePos = this.get_mouse_pos_for_action(e, true);

		//basically here you'd do something with the new mousePos when you're moving the mouse
	}

	constrain = ( min_limit, value, max_limit ) => {
		return Math.min( Math.max(min_limit, value), max_limit);
	}

	handle_canvas_click = ( e ) => {
		var mousePos = this.get_mouse_pos_for_action(e, true);

		//this is where you'd do something with myFunc(mousePos.x, mousePos.y );

		// in this function, you just figure out what operation you're actually going to do, and then you setState() that that operation is in progress.
		// over in track_canvas_move is where you have a big if-elseif chain that keys on what operation is actually being done, and it then handles all the logic of doing the actual drawing.
	}

	get_mouse_pos_for_action = ( e, should_constrain ) => {
		//const mousePos = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
		/*
			Possible TODO: e.offsetX is an experimental feature that may not be available in IE; if it's not, we'll need to calculate a similar value by getting our canvas's position on the page, and calculating an equivalent of the same value by subtracting the canvas position from e.pageX
		*/
		const bgRectSrc = this.canvas.getBoundingClientRect();
		const bgRect = { x: bgRectSrc.left, y: bgRectSrc.top, w: bgRectSrc.right - bgRectSrc.left, h: bgRectSrc.bottom - bgRectSrc.top };
		const mousePos = (() => { if(e.nativeEvent !== undefined) {
			return { x: e.nativeEvent.clientX - bgRect.x, y: e.nativeEvent.clientY - bgRect.y };
		} else {
			return { x: e.clientX - bgRect.x, y: e.clientY - bgRect.y };
		}})();

		if( should_constrain ){
			return {
				x: this.constrain(0, mousePos.x, bgRect.w),
				y: this.constrain(0, mousePos.y, bgRect.h)
			};
		} else {
			return {
				x: mousePos.x,
				y: mousePos.y,
			};
		}
	}

	mousedownListener = (e) => {
		this.handle_canvas_click(e);
		this.captureMouseEvents(e);
	}

	mousemoveListener = (e) => {
		this.track_canvas_move(e);
		e.stopPropagation();
		// do whatever is needed while the user is moving the cursor around
	}

	mouseupListener = (e) => {
		var restoreGlobalMouseEvents = () => {
			document.body.style['pointer-events'] = 'auto';
		}

		restoreGlobalMouseEvents ();
		document.removeEventListener ('mouseup',   this.mouseupListener,   {capture: true});
		document.removeEventListener ('mousemove', this.mousemoveListener, {capture: true});
		e.stopPropagation ();

		this.set_secondary_operation_mode(null);
		this.set_operation_grabber_index(null);
		this.setState({mousedown_pos: null});
	}

	captureMouseEvents = (e) => {
		var preventGlobalMouseEvents = () => {
			document.body.style['pointer-events'] = 'none';
		};

		preventGlobalMouseEvents ();
		document.addEventListener ('mouseup',   this.mouseupListener,   {capture: true});
		document.addEventListener ('mousemove', this.mousemoveListener, {capture: true});
		e.preventDefault ();
		e.stopPropagation ();
	}

/*----------------------- state manipulation -----------------------*/

	set_initial_mouse_pos = ( pos ) => {
		this.setState({mousedown_pos: pos });
	}

/*----------------------- react render -----------------------*/
	render() {
		return (
			<div className="ui-segment-container canvas-editor-container"
				style={ {
					height: this.props.expanded_ui ? '325px' : '0px',
					transition: 'all 0.25s',
				}}


			>


				<div className="canvas-container">
					<canvas ref={(node) => {this.canvas = node;}} width="567" height="325"/>

					<div
						className="sticker-gui-container"
						onMouseDown={ this.mousedownListener }
						onMouseMove={ this.mousemoveListener }

					>

					</div>




				</div>
			</div>
		);
	}
};







export default CanvasDraw;

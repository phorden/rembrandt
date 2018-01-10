import React from 'react';
import CanvasDraw from './components/canvas-draw/CanvasDraw.jsx';

// main styles
import './assets/scss/main.scss';


export default class MyApp extends React.Component {
	render() {
		return (
			<div className="app-wrapper">
                <h1>Rembrandt</h1>
				<CanvasDraw />
			</div>
		);
	}
};

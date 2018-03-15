import * as React from 'react';

export class SpinnerIconSvg extends React.Component {
	render() {
		return (
			<svg className='spinner' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
				<g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
					<circle className='spinner-circle' stroke='currentColor' strokeWidth='5' cx='32' cy='32' r='29'/>
					<path className='spinner-progress' stroke='currentColor' strokeWidth='5' d='M52.6861723,11.5097602 C47.418631,6.25144806 40.1470894,3 32.1161315,3 C24.0850974,3 16.8134942,6.25150964 11.545941,11.5099096'/>
				</g>
			</svg>
		);
	}
}

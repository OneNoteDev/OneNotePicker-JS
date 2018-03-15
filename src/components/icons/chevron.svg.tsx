import * as React from 'react';

export class ChevronSvg extends React.Component {
	render() {
		return (
			<svg className='chevron-icon' viewBox='0 0 15 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
				<g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
					<g fill='currentColor'>
						<polygon id='Triangle' points='7.5 0 15 8 0 8'/>
					</g>
				</g>
			</svg>
		);
	}
}

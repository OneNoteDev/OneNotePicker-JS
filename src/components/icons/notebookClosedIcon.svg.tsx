import * as React from 'react';

export class NotebookClosedIconSvg extends React.Component {
	render() {
		return (
			<svg className='notebook-closed-icon' viewBox='0 0 14 14' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
				<g className='icon-container' stroke='none' strokeWidth='1' fill='currentColor' fillRule='evenodd'>
					<path d='M13.5,9 L12,9 L12,12 L13.5,12 C13.741,12 14,11.53 14,10.5 C14,9.47 13.741,9 13.5,9 Z'/>
					<path d='M12,5 L12,8 L13.5,8 C13.741,8 14,7.531 14,6.5 C14,5.469 13.741,5 13.5,5 L12,5 Z'/>
					<path d='M14,2.5 C14,1.469 13.741,1 13.5,1 L12,1 L12,4 L13.5,4 C13.741,4 14,3.531 14,2.5 Z'/>
					<path d='M9,0 C10.104,0 11,0.896 11,2 L11,12 C11,13.104 10.104,14 9,14 L0,14 L0,0 L9,0 Z M2,5 L9,5 L9,3 L2,3 L2,5 Z'/>
				</g>
			</svg>
		);
	}
}

import * as React from 'react';

export class SectionGroupIconSvg extends React.Component {
	render() {
		return (
			<svg className='section-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' viewBox='0 0 20 20' fill='#444444'>
				<path d='M13,3H7v14h6v2h1V1h-1V3z' className='secondary-section-outline'/>
				<polygon points='11,1 5,1 5,15 6,15 6,2 11,2' className='primary-section-outline'/>
			</svg>
		);
	}
}
